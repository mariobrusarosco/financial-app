import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { I_CreateTransactionForm } from '../types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

// TODO: Replace with actual API service when available
const transactionsApi = {
  createTransaction: async (transaction: I_CreateTransactionForm) => {
    // Mock API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...transaction,
      amount: transaction.amount.toString(),
      is_deleted: false,
    };
  },
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (transaction: I_CreateTransactionForm) =>
      transactionsApi.createTransaction(transaction),
    onSuccess: newTransaction => {
      toast.success('Transaction created successfully!');

      // Partial key invalidation - invalidates ALL variations for the affected account
      if (newTransaction.account_id) {
        void queryClient.invalidateQueries({
          queryKey: ['account-transactions-paginated', newTransaction.account_id],
        });

        // Invalidate account details (balance changes)
        void queryClient.invalidateQueries({
          queryKey: ['accounts', 'account', newTransaction.account_id],
        });

        // Invalidate balance timeline
        void queryClient.invalidateQueries({
          queryKey: ['balance-points', newTransaction.account_id],
        });
      }

      // Invalidate active accounts list
      void queryClient.invalidateQueries({
        queryKey: ['accounts', 'active'],
      });

      // Close drawer
      void navigate({ search: {} });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to create transaction. Please try again.',
      });
    },
  });
};
