import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import type { I_CreditCardTransactionsParams } from '@/domains/credit-cards/types/types-and-interfaces';

export const GET_CREDIT_CARD_TRANSACTIONS_QUERY_KEY = (
  creditCardId: string,
  params?: I_CreditCardTransactionsParams
) => ['credit-card-transactions', creditCardId, params];

// Traditional pagination with keepPreviousData for smooth transitions
export const useCreditCardTransactions = (
  creditCardId: string,
  params?: I_CreditCardTransactionsParams
) => {
  return useQuery({
    queryKey: GET_CREDIT_CARD_TRANSACTIONS_QUERY_KEY(creditCardId, params),
    queryFn: () => creditCardApi.getCreditCardTransactions(creditCardId, params),
    enabled: !!creditCardId,
    placeholderData: keepPreviousData, // Keeps previous data while fetching new data
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
  });
};

// Infinite query version for infinite scroll/load more functionality
export const useCreditCardTransactionsInfinite = (
  creditCardId: string,
  baseParams?: Omit<I_CreditCardTransactionsParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: ['credit-card-transactions-infinite', creditCardId, baseParams],
    queryFn: ({ pageParam = 1 }) =>
      creditCardApi.getCreditCardTransactions(creditCardId, {
        ...baseParams,
        page: pageParam,
      }),
    enabled: !!creditCardId,
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
