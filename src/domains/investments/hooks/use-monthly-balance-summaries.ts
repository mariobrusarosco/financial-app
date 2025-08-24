import { useQuery } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments.api';
import type { I_MonthlyBalanceSummaryParams } from '../types/types-and-interfaces';

export const MONTHLY_BALANCE_SUMMARIES_QUERY_KEY = (params: I_MonthlyBalanceSummaryParams) => [
  'monthly-balance-summaries',
  params.account_id,
  params.year,
  params.months,
];

export const useMonthlyBalanceSummaries = (params: I_MonthlyBalanceSummaryParams) => {
  return useQuery({
    queryKey: MONTHLY_BALANCE_SUMMARIES_QUERY_KEY(params),
    queryFn: () => investmentsApi.getMonthlyBalanceSummaries(params),
    enabled: !!params.account_id,
  });
};