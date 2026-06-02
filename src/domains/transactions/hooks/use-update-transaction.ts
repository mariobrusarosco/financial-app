import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { updateTransaction } from '../api/transactions.api';
import type { I_TransactionResponse } from '../types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { toast } from 'sonner';
import { GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY } from '../api/keys';

export const useUpdateTransaction = ({
  onSuccess: onUpdateSuccess,
}: {
  onSuccess?: (data: I_TransactionResponse) => void;
}) => {
  const queryClient = useQueryClient();
  const params = useParams({ strict: false });
  const accountIdFromUrl = (params as any).slug;

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<I_TransactionResponse> }) =>
      updateTransaction(id, updates),
    onSuccess: data => {
      onUpdateSuccess?.(data);
      toast.success('Transaction updated successfully');
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to update transaction. Please try again.',
      });
    },
  });
};
