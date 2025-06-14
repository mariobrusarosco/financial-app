import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import { I_Account } from '@/domains/accounts/types/types-and-interfaces';

const GET_ALL_ACTIVE_ACCOUNTS_QUERY_KEY = () => ['accounts', 'active'];
const GET_ALL_ACCOUNTS_QUERY_KEY = () => ['accounts', 'all'];

export const useAccounts = () => {
  return useQuery<I_Account[], Error>({
    queryKey: GET_ALL_ACCOUNTS_QUERY_KEY(),
    queryFn: accountsApi.getAllAccounts,
    // Optional: Configure staleTime, cacheTime, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
    // refetchOnWindowFocus: false,
  });
};

export function useGetAllActiveAccounts() {
  return useQuery<I_Account[], Error>({
    queryKey: GET_ALL_ACTIVE_ACCOUNTS_QUERY_KEY(),
    queryFn: accountsApi.getAllActiveAccounts,
    // Optional: Configure staleTime, cacheTime, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
    // refetchOnWindowFocus: false,
  });
}
