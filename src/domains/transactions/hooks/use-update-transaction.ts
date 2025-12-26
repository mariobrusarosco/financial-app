import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '../api/transactions.api';
import type { I_TransactionResponse } from '../types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { toast } from 'sonner';
import { GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY } from '../api/keys';

export const useUpdateTransaction = (onUpdateSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<I_TransactionResponse> }) =>
      updateTransaction(id, updates),
    onSuccess: data => {
      onUpdateSuccess?.();
      toast.success('Transaction updated successfully');
      // Invalidate account transactions caches for all affected accounts
      void queryClient.invalidateQueries({
        queryKey: GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY(data.account_id),
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to update transaction. Please try again.',
      });
    },
  });
};
