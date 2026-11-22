import { useQuery } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments.api';
import type { I_MonthlyBalanceSummaryParams } from '../types/types-and-interfaces';

// Every year of one account's summaries: the prefix to invalidate after a save.
export const ACCOUNT_MONTHLY_BALANCE_SUMMARIES_QUERY_KEY = (accountId: string) => [
  'monthly-balance-summaries',
  accountId,
];

export const MONTHLY_BALANCE_SUMMARIES_QUERY_KEY = (params: I_MonthlyBalanceSummaryParams) => [
  ...ACCOUNT_MONTHLY_BALANCE_SUMMARIES_QUERY_KEY(params.account_id),
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
