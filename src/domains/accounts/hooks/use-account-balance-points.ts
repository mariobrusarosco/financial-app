import { useQuery } from '@tanstack/react-query';
import { accountsApi, I_BalancePoint } from '@/domains/accounts/api';
import { GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY } from '@/domains/accounts/api/keys';

export const useAccountBalancePoints = (accountId: string, startDate: string, endDate: string) => {
  return useQuery<I_BalancePoint[], Error>({
    queryKey: GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY(accountId, startDate, endDate),
    queryFn: () => accountsApi.getAccountBalancePoints(accountId, startDate, endDate),
    enabled: !!accountId && !!startDate && !!endDate,
  });
};
