import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '@/domains/transactions/api/transactions.api';
import { invalidateAllTransactionRelatedQueries } from '@/domains/transactions/hooks/use-update-transaction';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

interface UpdateTransactionTagsInput {
  transactionId: string;
  tagIds: string[];
}

/**
 * Replaces a transaction's tags. Optimistic display is handled by the caller (the row keeps the
 * pending selection until fresh data arrives), so this works for every list regardless of cache shape.
 */
export const useUpdateTransactionTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, tagIds }: UpdateTransactionTagsInput) =>
      updateTransaction(transactionId, { tag_ids: tagIds }),
    onSuccess: data => {
      queryClient.setQueryData(['transaction', data.id], data);
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to update tags. Please try again.',
      });
    },
    onSettled: () => {
      invalidateAllTransactionRelatedQueries(queryClient);
    },
  });
};
