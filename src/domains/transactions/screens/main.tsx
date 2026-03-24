import { useState, useMemo, useEffect } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsErrorState } from '@/domains/transactions/components/transactions-error-state';
import { TransactionsLoadingState } from '@/domains/transactions/components/transactions-loading-state';
import { TransactionsEmptyState } from '@/domains/transactions/components/transactions-empty-state';
import { TransactionsList } from '@/domains/transactions/components/transactions-list';
import { AccountTransactionFilters } from '@/domains/transactions/components/account-transaction-filters';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/transactions/index';

const ITEMS_PER_PAGE = 20;
const DEFAULT_SORT_BY: NonNullable<I_AccountTransactionsParams['sort_by']> = 'date';
const DEFAULT_SORT_ORDER: NonNullable<I_AccountTransactionsParams['sort_order']> = 'desc';

export const TransactionsMainScreen = () => {
  const { from, to, sort_by, sort_order } = Route.useSearch();
  const navigate = Route.useNavigate();
  const resolvedSortBy = sort_by ?? DEFAULT_SORT_BY;
  const resolvedSortOrder = sort_order ?? DEFAULT_SORT_ORDER;

  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: resolvedSortBy,
    sort_order: resolvedSortOrder,
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from,
      date_to: to,
      sort_by: resolvedSortBy,
      sort_order: resolvedSortOrder,
    }),
    [params, from, to, resolvedSortBy, resolvedSortOrder]
  );

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

  const handleParamsChange = (nextParams: I_AccountTransactionsParams) => {
    const nextSortBy = nextParams.sort_by ?? DEFAULT_SORT_BY;
    const nextSortOrder = nextParams.sort_order ?? DEFAULT_SORT_ORDER;

    setParams(nextParams);

    if (nextSortBy === resolvedSortBy && nextSortOrder === resolvedSortOrder) {
      return;
    }

    void navigate({
      search: prev => ({
        ...prev,
        sort_by: nextSortBy,
        sort_order: nextSortOrder,
      }),
    });
  };

  return (
    <div data-ui="transactions-main-screen" className="flex flex-col h-full gap-4">
      <AccountTransactionFilters params={mergedParams} onParamsChange={handleParamsChange} />

      {error ? (
        <TransactionsErrorState />
      ) : isLoading && !isPlaceholderData ? (
        <TransactionsLoadingState />
      ) : transactions.length === 0 &&
        !isLoading &&
        !isPlaceholderData &&
        !Object.keys(params).some(
          k => k !== 'page' && k !== 'per_page' && k !== 'sort_by' && k !== 'sort_order'
        ) ? (
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
