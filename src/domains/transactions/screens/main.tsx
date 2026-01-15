import { useState, useMemo } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsErrorState } from '../components/transactions-error-state';
import { TransactionsLoadingState } from '../components/transactions-loading-state';
import { TransactionsEmptyState } from '../components/transactions-empty-state';
import { TransactionsList } from '../components/transactions-list';
import { Route } from '@/routes/(auth)/route';
import { AccountTransactionFilters } from '../components/account-transaction-filters';
import type { I_AccountTransactionsParams } from '../types/types-and-interfaces';

const ITEMS_PER_PAGE = 20;

export const TransactionsMainScreen = () => {
  const { from, to } = Route.useSearch();
  
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(() => ({
    ...params,
    date_from: from,
    date_to: to,
  }), [params, from, to]);

  const { data, isLoading, error, isPlaceholderData } = useAllTransactionsWithPagination(
    mergedParams.page,
    mergedParams.per_page,
    mergedParams
  );

  const transactions = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="px-1">
        <AccountTransactionFilters 
          params={mergedParams} 
          onParamsChange={setParams} 
        />
      </div>

      {(error) ? (
        <TransactionsErrorState />
      ) : (isLoading && !isPlaceholderData) ? (
        <TransactionsLoadingState />
      ) : (transactions.length === 0 && !isLoading && !isPlaceholderData && !Object.keys(params).some(k => k !== 'page' && k !== 'per_page' && k !== 'sort_by' && k !== 'sort_order')) ? (
        <TransactionsEmptyState />
      ) : (
        <TransactionsList
          transactions={transactions}
          meta={meta}
          isPlaceholderData={isPlaceholderData}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
