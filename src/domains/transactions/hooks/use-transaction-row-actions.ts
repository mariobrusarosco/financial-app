import { useNavigate } from '@tanstack/react-router';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { useDeleteTransaction } from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';

/**
 * Edit / ignore / delete for a saved transaction, shared by every list so rows behave the same
 * everywhere. Lists don't wire these handlers themselves.
 */
export const useTransactionRowActions = (transaction: I_TransactionResponse) => {
  const navigate = useNavigate();
  const { mutate: updateTransaction, isPending: isUpdating } = useUpdateTransaction({});
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

  const openEdit = () => {
    void navigate({
      to: '.',
      search: prev => ({ ...prev, drawer: 'transaction-edit', transactionId: transaction.id }),
    });
  };

  const toggleIgnored = () => {
    updateTransaction({ id: transaction.id, updates: { ignored: !transaction.ignored } });
  };

  const remove = (options?: { onSuccess?: () => void }) => {
    deleteTransaction(transaction.id, { onSuccess: options?.onSuccess });
  };

  return {
    openEdit,
    toggleIgnored,
    remove,
    isUpdating,
    isDeleting,
  };
};
