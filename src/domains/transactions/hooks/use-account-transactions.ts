import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { I_AccountTransactionsParams } from '../types/types-and-interfaces';

// Query key factory
export const getAccountTransactionsQueryKey = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => ['account-transactions', accountId, params];

export const useAccountTransactions = (
  accountId: string | undefined,
  params?: I_AccountTransactionsParams
) => {
  return useQuery({
    queryKey: getAccountTransactionsQueryKey(accountId || '', params),
    queryFn: () => transactionsApi.getAccountTransactions(accountId!, params),
    enabled: !!accountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Convenience hooks for common use cases
export const useAccountTransactionsWithPagination = (
  accountId: string | undefined,
  page = 1,
  perPage = 20,
  filters?: Omit<I_AccountTransactionsParams, 'page' | 'per_page'>
) => {
  return useAccountTransactions(accountId, {
    page,
    per_page: perPage,
    sort_by: 'date',
    sort_order: 'desc', // Newest first by default
    ...filters,
  });
};

export const useAccountRecentTransactions = (accountId: string | undefined, limit = 10) => {
  return useAccountTransactions(accountId, {
    page: 1,
    per_page: limit,
    sort_by: 'date',
    sort_order: 'desc',
  });
};
