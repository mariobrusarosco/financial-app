import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';

const GET_ACCOUNT_QUERY_KEY = (id: string) => ['accounts', 'account', id];

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: GET_ACCOUNT_QUERY_KEY(id),
    queryFn: () => accountsApi.getAccount(id),
    enabled: !!id,
  });
};
