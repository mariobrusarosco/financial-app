import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { updateTransaction } from '../api/transactions.api';
import type { I_TransactionResponse } from '../types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { toast } from 'sonner';
import { GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY } from '../api/keys';

export const useUpdateTransaction = (onUpdateSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const params = useParams({ strict: false });
  const accountIdFromUrl = (params as any).slug;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<I_TransactionResponse> }) =>
      updateTransaction(id, updates),
    onSuccess: data => {
      // Use account ID from URL (for credit card transactions on account pages)
      // or from transaction data (for direct account transactions)
      const accountId = accountIdFromUrl || data.account_id;

      console.log('🔄 Transaction update SUCCESS', { data, accountIdFromUrl, accountId });

      onUpdateSuccess?.();
      toast.success('Transaction updated successfully');

      if (accountId) {
        console.log('🔑 Invalidating for account:', accountId);

        // Partial key invalidation - invalidates ALL variations (pages, filters, etc.)
        void queryClient.invalidateQueries({
          queryKey: GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY(accountId),
        });

        // Invalidate account details (balance changes)
        void queryClient.invalidateQueries({
          queryKey: ['accounts', 'account', accountId],
        });

        // Invalidate balance timeline (transaction amounts/dates affect balance history)
        void queryClient.invalidateQueries({
          queryKey: ['balance-points', accountId],
        });
      }

      // Invalidate active accounts list (may show balances in sidebar/dropdown)
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'active'],
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to update transaction. Please try again.',
      });
    },
  });
};
