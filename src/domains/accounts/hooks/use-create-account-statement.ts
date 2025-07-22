import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi, I_CreateAccountStatementRequest } from '@/domains/accounts/api';

export const useCreateAccountStatement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: I_CreateAccountStatementRequest) => {
      return await accountsApi.createAccountStatement(data);
    },
    onSuccess: data => {
      console.log('Account statement created successfully:', data);

      // Invalidate account statements query
      void queryClient.invalidateQueries({
        queryKey: ['account-statements', data.account_id],
      });

      // Invalidate account transactions if they exist
      void queryClient.invalidateQueries({
        queryKey: ['account-transactions', data.account_id],
      });
    },
    onError: error => {
      console.error('Failed to create account statement:', error);
    },
  });

  return {
    mutation,
    createStatement: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
