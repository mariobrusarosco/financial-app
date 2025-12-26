import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { I_CreateTransactionForm } from '../types/types-and-interfaces';
import { transactionsApi, transformFormToBulkRequest } from '../api/transactions.api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useCreateBulkTransactions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (transactions: I_CreateTransactionForm[]) => {
      const bulkRequest = {
        transactions: transformFormToBulkRequest(transactions),
      };
      return transactionsApi.createBulkTransactions(bulkRequest);
    },
    onSuccess: (response, variables) => {
      const { total_submitted, total_successful, total_failed, success_rate } = response;

      if (total_failed === 0) {
        toast.success(`Successfully created ${total_successful} transactions!`);
      } else if (total_successful > 0) {
        toast.warning(
          `${total_successful} transactions created, ${total_failed} failed (${success_rate.toFixed(1)}% success rate)`
        );
      } else {
        toast.error(`Failed to create all ${total_submitted} transactions`);
      }

      // Partial key invalidation for all affected accounts
      if (total_successful > 0) {
        const affectedAccountIds = new Set(
          variables.map(t => t.account_id).filter((id): id is string => Boolean(id))
        );

        // Invalidate all related queries for each affected account
        affectedAccountIds.forEach(accountId => {
          // All transaction lists (paginated, infinite, regular)
          void queryClient.invalidateQueries({
            queryKey: ['account-transactions-paginated', accountId],
          });
          void queryClient.invalidateQueries({
            queryKey: ['account-transactions-infinite', accountId],
          });
          void queryClient.invalidateQueries({
            queryKey: ['account-transactions', accountId],
          });

          // Account details (balance changes)
          void queryClient.invalidateQueries({
            queryKey: ['accounts', 'account', accountId],
          });

          // Balance timeline
          void queryClient.invalidateQueries({
            queryKey: ['balance-points', accountId],
          });
        });

        // Invalidate active accounts list
        void queryClient.invalidateQueries({
          queryKey: ['accounts', 'active'],
        });

        // Close drawer on success
        // @ts-ignore
        void navigate({ search: {} });
      }
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to create transactions. Please try again.',
      });
    },
  });
};
