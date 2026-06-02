import { useState, useMemo, useEffect } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsErrorState } from '@/domains/transactions/components/transactions-error-state';
import { TransactionsEmptyState } from '@/domains/transactions/components/transactions-empty-state';
import { TransactionsList } from '@/domains/transactions/components/transactions-list';
import { AccountTransactionFilters } from '@/domains/transactions/components/account-transaction-filters';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/transactions/index';
import { PageHeader } from '@/domains/global/components';
import { ArrowRightLeft, RefreshCcw } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';

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

  const { data, isFetching, error, isPlaceholderData } = useAllTransactionsWithPagination(
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

  console.log({ isFetching });

  return (
    <div data-ui="transactions-main-screen" className="flex flex-col h-full">
      <div className="flex items-center gap-2  items-start pb-3">
        <ArrowRightLeft className="bg-transactions text-neutral-white rounded-md p-2.5 h-10 w-10" />

        <div className="flex flex-col gap-2">
          <h1 className="text-5xl text-primary tracking-tight leading-[0.7]">Transactions</h1>
          <p className="text-sm text-primary tracking-tight">Found {meta?.total} transactions</p>
        </div>
      </div>

      {/* <AccountTransactionFilters params={mergedParams} onParamsChange={handleParamsChange} /> */}

      {isFetching && !error && (
        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <div className="p-6 rounded-3xl">
            <RefreshCcw className="h-15 w-15 animate-spin text-muted-foreground/50 stroke-1 transform-origin-center" />
          </div>
        </div>
      )}

      {error ? (
        <TransactionsErrorState />
      ) : transactions.length === 0 &&
        !isFetching &&
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
