import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '@/domains/transactions/api/transactions.api';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';

export const GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => ['account-transactions-paginated', accountId, params];

// Traditional pagination with keepPreviousData for smooth transitions
export const useAccountTransactionsPaginated = (
  accountId: string,
  params?: I_AccountTransactionsParams,
  includeCreditCards: boolean = true // Default to include credit cards for unified view
) => {
  const queryParams = {
    ...params,
    include_credit_cards: includeCreditCards,
  };

  return useQuery({
    queryKey: GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY(accountId, queryParams),
    queryFn: () => transactionsApi.getAccountTransactions(accountId, queryParams),
    enabled: !!accountId,
    placeholderData: keepPreviousData, // Prevents UI flickering
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
  });
};

// Infinite query version for infinite scroll/load more functionality
export const useAccountTransactionsInfinite = (
  accountId: string,
  baseParams?: Omit<I_AccountTransactionsParams, 'page'>,
  includeCreditCards: boolean = true // Default to include credit cards for unified view
) => {
  const queryParams = {
    ...baseParams,
    include_credit_cards: includeCreditCards,
  };

  return useInfiniteQuery({
    queryKey: ['account-transactions-infinite', accountId, queryParams],
    queryFn: ({ pageParam = 1 }) =>
      transactionsApi.getAccountTransactions(accountId, {
        ...queryParams,
        page: pageParam,
      }),
    enabled: !!accountId,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      // Return next page number if there are more pages
      return lastPage.meta.has_next ? lastPage.meta.page + 1 : undefined;
    },
    getPreviousPageParam: firstPage => {
      // Return previous page number if there are previous pages
      return firstPage.meta.has_previous ? firstPage.meta.page - 1 : undefined;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
