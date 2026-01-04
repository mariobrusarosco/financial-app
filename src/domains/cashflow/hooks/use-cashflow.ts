import { useMemo } from 'react';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { aggregateCashflowData } from '../utils/cashflow-utils';
import { I_CashflowFilter } from '../types';

export const useCashflow = (filters?: I_CashflowFilter) => {
  // We fetch all transactions for the filtered range
  // Note: For a large number of transactions, we might want a specialized backend endpoint
  const { data, isLoading, error, isPlaceholderData } = useAllTransactions({
    date_from: filters?.date_from,
    date_to: filters?.date_to,
    per_page: 100, // Temporary limit: Backend enforces max 100. We need a non-paginated endpoint for full accuracy.
    sort_by: 'date',
    sort_order: 'asc',
  });

  const cashflowSummary = useMemo(() => {
    if (!data?.data) return null;
    return aggregateCashflowData(data.data);
  }, [data]);

  return {
    data: cashflowSummary,
    isLoading,
    error,
    isPlaceholderData,
  };
};
