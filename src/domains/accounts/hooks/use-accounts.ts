import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import {
  I_Account,
  I_AccountsParams,
  T_AccountType,
} from '@/domains/accounts/types/types-and-interfaces';
import { GET_ACCOUNTS_QUERY_KEY } from '@/domains/accounts/api/keys';

export const useAccounts = (params?: I_AccountsParams) => {
  const accountsQuery = useQuery<I_Account[], Error>({
    queryKey: GET_ACCOUNTS_QUERY_KEY(params),
    queryFn: () => accountsApi.getAccounts(params),
    select: getAccountsData,
    // Optional: Configure staleTime, cacheTime, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
    // refetchOnWindowFocus: false,
  });

  return {
    accounts: {
      query: accountsQuery,
      actions: {
        refetchAccounts: accountsQuery.refetch,
      },
    },
  };
};

export function useGetAllActiveAccounts() {
  return useAccounts({ is_active: true });
}

const getAccountsData = (accounts: I_Account[]) => {
  const accountsByType = getAccountsByType(accounts);

  return {
    accounts,
    accountsByType,
    accountGroups: getAccountGroups(accountsByType),
    totalAccounts: accounts.length,
    isEmpty: accounts.length === 0,
  };
};

const getAccountsByType = (accounts: I_Account[]) => {
  return accounts.reduce(
    (accountsByType, account) => {
      accountsByType[account.type] = [...(accountsByType[account.type] ?? []), account];
      return accountsByType;
    },
    {} as Partial<Record<T_AccountType, I_Account[]>>
  );
};

const getAccountGroups = (accountsByType: Partial<Record<T_AccountType, I_Account[]>>) => {
  return Object.entries(accountsByType).map(([type, accounts = []]) => ({
    type: type as T_AccountType,
    accounts,
  }));
};
