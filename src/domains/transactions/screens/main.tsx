import { useEffect } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsList } from '@/domains/transactions/components/transactions-list';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/transactions/index';
import { ArrowRightLeft, CreditCard, RefreshCcw, XCircle } from 'lucide-react';
import { PageHeader } from '@/domains/global/components/page-header';
import { AccountTransactionFilters } from '@/domains/transactions/components/account-transaction-filters';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const ITEMS_PER_PAGE = 20;
const START_PAGE = 1;
const DEFAULT_SORT_BY = 'date';
const DEFAULT_SORT_ORDER = 'desc';

export const TransactionsMainScreen = () => {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { openTransactionCreate } = useGlobalUIState();
  const { data, isFetching, error } = useAllTransactionsWithPagination(
    search.page ?? START_PAGE,
    search.per_page ?? ITEMS_PER_PAGE,
    search
  );
  const transactions = data?.data || [];
  const meta = data?.meta;
  const inLoadingState = isFetching && !error;
  const inErrorState = !!error;
  const isEmptyState = !inLoadingState && !inErrorState && transactions.length === 0;
  const handleParamsChange = (nextParams: I_AccountTransactionsParams) => {
    void navigate({
      search: prev => ({
        ...prev,
        ...nextParams,
      }),
    });
  };
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
    <div data-ui="transactions-main-screen" className="flex min-h-full flex-col gap-6 pb-8">
      <div>
        <PageHeader
          title="Transactions"
          icon={ArrowRightLeft}
          onAdd={openTransactionCreate}
          addButtonLabel="New transaction"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {inLoadingState ? 'Loading transactions…' : `${meta?.total ?? 0} transactions found`}
        </p>
      </div>

      {inLoadingState && (
        <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-border/80 bg-card">
          <div className="rounded-2xl bg-muted p-4">
            <RefreshCcw className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your activity…</p>
        </div>
      )}

      {inErrorState && <TransactionsErrorState />}
      {isEmptyState && <TransactionsEmptyState />}

      {!inLoadingState && !inErrorState && !isEmptyState && (
        <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] sm:p-5">
          <AccountTransactionFilters params={search} onParamsChange={handleParamsChange} />
          <TransactionsList
            transactions={transactions}
            meta={meta}
            onParamsChange={handleParamsChange}
          />
        </section>
      )}
    </div>
  );
};

const TransactionsEmptyState = () => {
  return (
    <div data-ui="transactions-main-screen-empty" className="min-h-72 flex-1">
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="rounded-2xl bg-pastel-blue p-4">
          <CreditCard className="h-7 w-7 text-brand" />
        </div>
        <p className="font-semibold text-foreground">No transactions yet</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Transactions will appear here once you start using your accounts
        </p>
      </div>
    </div>
  );
};

const TransactionsErrorState = () => {
  return (
    <div data-ui="transactions-main-screen-error" className="min-h-72 flex-1">
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <div className="rounded-2xl bg-destructive/10 p-4">
          <XCircle className="h-7 w-7 text-destructive" />
        </div>
        <p className="font-semibold text-destructive">We couldn&apos;t load your transactions.</p>
      </div>
    </div>
  );
};
