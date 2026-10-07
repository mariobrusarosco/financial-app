import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { GET_ALL_TRANSACTIONS_QUERY_KEY } from '@/domains/transactions/api/keys';
import { updateTransaction } from '@/domains/transactions/api/transactions.api';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useUpdateTransaction = ({
  onSuccess: onUpdateSuccess,
}: {
  onSuccess?: (data: I_TransactionResponse) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: UpdateTransactionInput) => updateTransaction(id, updates),
    onSuccess: data => {
      queryClient.setQueryData(['transaction', data.id], data);
      invalidateAllTransactionRelatedQueries(queryClient);

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

const invalidateAllTransactionRelatedQueries = (queryClient: QueryClient) => {
  TRANSACTION_RELATED_QUERY_KEYS.forEach(queryKey => {
    void queryClient.invalidateQueries({ queryKey });
  });
};

const TRANSACTION_RELATED_QUERY_KEYS: QueryKey[] = [
  ['transaction'],
  GET_ALL_TRANSACTIONS_QUERY_KEY(),
  ['account-transactions'],
  ['account-transactions-paginated'],
  ['account-transactions-infinite'],
  ['account-transactions-combined'],
  ['credit-card-transactions'],
  ['credit-card-transactions-infinite'],
  ['accounts'],
  ['balance-points'],
  ['cashflow-summary'],
  ['credit-cards'],
  ['credit_cards'],
];

interface UpdateTransactionInput {
  id: string;
  updates: Partial<I_TransactionResponse>;
}
