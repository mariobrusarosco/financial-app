import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import { GET_ACCOUNT_QUERY_KEY } from '../api/keys';

export const useAccountBalance = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountsApi.updateAccountBalance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_ACCOUNT_QUERY_KEY(id) });
    },
  });
};
