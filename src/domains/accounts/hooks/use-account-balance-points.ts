import { useQuery } from '@tanstack/react-query';
import { accountsApi, I_BalancePoint } from '@/domains/accounts/api';
import { GET_ACCOUNT_BALANCE_POINTS_QUERY_KEY } from '@/domains/accounts/api/keys';

export const useAccountBalancePoints = (accountId: string) => {
  return useQuery<I_BalancePoint[], Error>({
    queryKey: GET_ACCOUNT_BALANCE_POINTS_QUERY_KEY(accountId),
    queryFn: () => accountsApi.getAccountBalancePoints(accountId),
    enabled: !!accountId,
  });
};
