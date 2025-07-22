import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';

export const GET_ACCOUNT_STATEMENTS_QUERY_KEY = (accountId: string) => [
  'account-statements',
  accountId,
];

export const useAccountStatements = (accountId: string) => {
  return useQuery({
    queryKey: GET_ACCOUNT_STATEMENTS_QUERY_KEY(accountId),
    queryFn: () => accountsApi.getAccountStatements(accountId),
    enabled: !!accountId,
  });
};
