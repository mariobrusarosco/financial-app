import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import { GET_ACCOUNT_QUERY_KEY } from '@/domains/accounts/api/keys';

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: GET_ACCOUNT_QUERY_KEY(id),
    queryFn: () => accountsApi.getAccount(id),
    enabled: !!id,
  });
};
