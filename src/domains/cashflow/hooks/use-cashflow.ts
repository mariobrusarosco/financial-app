import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { cashflowApi } from '@/domains/cashflow/api/cashflow.api';
import type { I_CashflowFilter } from '@/domains/cashflow/types/index';

export const useCashflow = (filters?: I_CashflowFilter) => {
  const resolvedFilters = resolveCashflowFilters(filters);

  return useQuery({
    queryKey: ['cashflow-summary', resolvedFilters],
    queryFn: () => cashflowApi.getSummary(resolvedFilters),
    placeholderData: keepPreviousData,
  });
};

const resolveCashflowFilters = (filters?: I_CashflowFilter): I_CashflowFilter => {
  const today = new Date();

  return {
    date_from: filters?.date_from ?? format(startOfMonth(today), 'yyyy-MM-dd'),
    date_to: filters?.date_to ?? format(endOfMonth(today), 'yyyy-MM-dd'),
    account_id: filters?.account_id,
  };
};
