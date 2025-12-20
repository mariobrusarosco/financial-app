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

      // Invalidate transaction queries - using base key matches all variations
      void queryClient.invalidateQueries({
        queryKey: GET_ALL_TRANSACTIONS_QUERY_KEY(),
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

      // Invalidate transaction queries - using base key matches all variations
      void queryClient.invalidateQueries({
        queryKey: ['account-transactions-paginated'],
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to delete transaction. Please try again.',
      });
    },
  });
};
