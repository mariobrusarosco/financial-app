import { useQuery } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments.api';
import type { I_InvestmentBalanceHistoryParams } from '../types/types-and-interfaces';

// Query key factory
export const getInvestmentBalanceHistoryQueryKey = (
  investmentId: string | undefined,
  params?: I_InvestmentBalanceHistoryParams
) => ['investment-balance-history', investmentId, params];

export const getAllInvestmentBalancesQueryKey = (params?: I_InvestmentBalanceHistoryParams) => [
  'all-investment-balances',
  params,
];

// Get balance history for specific investment
export const useInvestmentBalanceHistory = (
  investmentId: string | undefined,
  params?: I_InvestmentBalanceHistoryParams
) => {
  return useQuery({
    queryKey: getInvestmentBalanceHistoryQueryKey(investmentId, params),
    queryFn: () => investmentsApi.getInvestmentBalanceHistory(investmentId!, params),
    enabled: !!investmentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get balance history for all investments
export const useAllInvestmentBalances = (params?: I_InvestmentBalanceHistoryParams) => {
  return useQuery({
    queryKey: getAllInvestmentBalancesQueryKey(params),
    queryFn: () => investmentsApi.getAllInvestmentBalances(params),
    staleTime: 1000 * 60 * 5,
  });
};

// Convenience hooks for common use cases
export const useInvestmentBalanceHistoryWithPagination = (
  investmentId: string | undefined,
  page: number = 1,
  perPage: number = 20,
  filters?: Omit<I_InvestmentBalanceHistoryParams, 'page' | 'per_page'>
) => {
  return useInvestmentBalanceHistory(investmentId, {
    page,
    per_page: perPage,
    sort_by: 'date',
    sort_order: 'desc', // Newest first by default
    ...filters,
  });
};

export const useAllInvestmentBalancesWithPagination = (
  page: number = 1,
  perPage: number = 20,
  filters?: Omit<I_InvestmentBalanceHistoryParams, 'page' | 'per_page'>
) => {
  return useAllInvestmentBalances({
    page,
    per_page: perPage,
    sort_by: 'date',
    sort_order: 'desc',
    ...filters,
  });
};
