import { useState, useMemo } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsList } from '@/domains/transactions/components/transactions-list';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/transactions/index';
import { ArrowRightLeft, CreditCard, RefreshCcw, XCircle } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { PageHeader } from '@/domains/global/components/page-header';

const ITEMS_PER_PAGE = 20;
const START_PAGE = 1;
const DEFAULT_SORT_BY = 'date';
const DEFAULT_SORT_ORDER = 'desc';

export const TransactionsMainScreen = () => {
  // Hooks
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { data, isFetching, error, isPlaceholderData } = useAllTransactionsWithPagination(
    search.page ?? START_PAGE,
    search.per_page ?? ITEMS_PER_PAGE,
    search
  );
  // States
  const transactions = data?.data || [];
  const meta = data?.meta;
  // Derived state
  const inLoadingState = isFetching && !error;
  const inErrorState = !!error;
  const isEmptyState = !inLoadingState && !inErrorState && transactions.length === 0;
  // Hanlders and callbacks
  const handleParamsChange = (nextParams: I_AccountTransactionsParams) => {
    void navigate({
      search: prev => ({
        ...prev,
        ...nextParams,
      }),
    });
  };
  // Effects
  useEffect(function InitTransactionsSearchParamsOnMount() {
    void navigate({
      search: {
        page: search.page ?? START_PAGE,
        per_page: search.per_page ?? ITEMS_PER_PAGE,
        sort_by: search.sort_by ?? DEFAULT_SORT_BY,
        sort_order: search.sort_order ?? DEFAULT_SORT_ORDER,
        date_from: search.date_from,
        date_to: search.date_to,
      },
    });
  }, []);

  return (
    <div data-ui="transactions-main-screen" className="flex flex-col h-full">
      <div className="flex items-center gap-2  items-start pb-3">
        <ArrowRightLeft className="bg-transactions text-neutral-white rounded-md p-2.5 h-10 w-10" />

        <div className="flex flex-col gap-2">
          <h1 className="text-5xl text-primary tracking-tight leading-[0.7]">Transactions</h1>
          {!inLoadingState && (
            <p className="text-sm text-primary tracking-tight">Found {meta?.total} transactions</p>
          )}
          {inLoadingState && (
            <p className="text-sm text-primary tracking-tight">Loading transactions...</p>
          )}
        </div>
      </div>

      {/* <AccountTransactionFilters params={mergedParams} onParamsChange={handleParamsChange} /> */}

      {inLoadingState && (
        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <div className="p-6 rounded-3xl">
            <RefreshCcw className="h-15 w-15 animate-spin text-muted-foreground/50 stroke-1 transform-origin-center" />
          </div>
        </div>
      )}

      {inErrorState && <TransactionsErrorState />}
      {isEmptyState && <TransactionsEmptyState />}

      <TransactionsList
        transactions={transactions}
        meta={meta}
        onParamsChange={handleParamsChange}
      />
    </div>
  );
};

const TransactionsEmptyState = () => {
  return (
    <div data-ui="transactions-main-screen-empty" className="w-full flex-1 h-full">
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <div className="p-6 bg-muted-foreground/10 rounded-3xl">
          <CreditCard className="h-15 w-15 text-muted-foreground stroke-1" />
        </div>
        <p className="text-2xl font-light">No transactions yet</p>
        <p className="text-muted-foreground mb-4">
          Transactions will appear here once you start using your accounts
        </p>
      </div>
    </div>
  );
};

const TransactionsErrorState = () => {
  return (
    <div data-ui="transactions-main-screen-error" className="w-full flex-1 h-full">
      <div className="flex flex-col gap-4 h-full">
        <PageHeader title="Transaction History" icon={ArrowRightLeft} showAddButton={false} />
        <h2>A complete record of all your financial transactions</h2>

        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <div className="p-6 bg-destructive/10 rounded-3xl">
            <XCircle className="h-15 w-15 text-destructive stroke-1" />
          </div>
          <p className="text-destructive text-2xl font-light">
            Ops! Something went wrong while loading transactions
          </p>
        </div>
      </div>
    </div>
  );
};
