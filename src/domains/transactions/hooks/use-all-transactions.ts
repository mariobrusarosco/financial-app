import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { I_AccountTransactionsParams } from '../types/types-and-interfaces';

// Query key factory
export const getAllTransactionsQueryKey = (params?: I_AccountTransactionsParams) => [
  'all-transactions',
  params,
];

export const useAllTransactions = (params?: I_AccountTransactionsParams) => {
  return useQuery({
    queryKey: getAllTransactionsQueryKey(params),
    queryFn: () => transactionsApi.getAllTransactions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Convenience hooks for common use cases
export const useAllTransactionsWithPagination = (
  page = 1,
  perPage = 20,
  filters?: Omit<I_AccountTransactionsParams, 'page' | 'per_page'>
) => {
  return useAllTransactions({
    page,
    per_page: perPage,
    sort_by: 'date',
    sort_order: 'desc', // Newest first by default
    ...filters,
  });
};

export const useRecentTransactions = (limit = 10) => {
  return useAllTransactions({
    page: 1,
    per_page: limit,
    sort_by: 'date',
    sort_order: 'desc',
  });
};
