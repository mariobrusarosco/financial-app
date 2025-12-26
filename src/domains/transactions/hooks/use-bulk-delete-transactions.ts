import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionsApi } from '../api/transactions.api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { GET_ALL_TRANSACTIONS_QUERY_KEY } from '../api/keys';

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds: string[]) =>
      transactionsApi.deleteBulkTransactions(transactionIds),
    onSuccess: result => {
      toast.success(`Successfully deleted ${result.deleted_count} transactions`);

      // Partial key invalidation - invalidates ALL variations
      void queryClient.invalidateQueries({
        queryKey: GET_ALL_TRANSACTIONS_QUERY_KEY(),
      });

      // Invalidate all account transactions (transactions may belong to multiple accounts)
      void queryClient.invalidateQueries({
        queryKey: ['account-transactions-paginated'],
      });

      // Invalidate all account details (balances may have changed)
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'account'],
      });

      // Invalidate all balance timelines
      void queryClient.invalidateQueries({
        queryKey: ['balance-points'],
      });

      // Invalidate active accounts list
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'active'],
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to delete transactions. Please try again.',
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => transactionsApi.deleteTransaction(transactionId),
    onSuccess: () => {
      toast.success('Transaction deleted successfully');

      // Partial key invalidation - invalidates ALL account transactions
      // (we don't know which account this transaction belonged to from the API response)
      void queryClient.invalidateQueries({
        queryKey: ['account-transactions-paginated'],
      });

      // Invalidate all account details (balances may have changed)
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'account'],
      });

      // Invalidate all balance timelines
      void queryClient.invalidateQueries({
        queryKey: ['balance-points'],
      });

      // Invalidate active accounts list
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'active'],
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to delete transaction. Please try again.',
      });
    },
  });
};
