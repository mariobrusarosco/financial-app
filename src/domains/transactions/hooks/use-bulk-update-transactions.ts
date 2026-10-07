import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionsApi } from '@/domains/transactions/api/transactions.api';
import { invalidateAllTransactionRelatedQueries } from '@/domains/transactions/hooks/use-update-transaction';
import type { I_BulkUpdateTransactionsRequest } from '@/domains/transactions/types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useBulkUpdateTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: I_BulkUpdateTransactionsRequest) =>
      transactionsApi.updateBulkTransactions(payload),
    onSuccess: (_, payload) => {
      invalidateAllTransactionRelatedQueries(queryClient);
      toast.success(
        `${payload.transaction_ids.length} ${payload.transaction_ids.length === 1 ? 'transaction' : 'transactions'} updated successfully`
      );
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to update the selected transactions. Please try again.',
      });
    },
  });
};
