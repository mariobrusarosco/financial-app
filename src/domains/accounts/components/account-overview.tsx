import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY } from '@/domains/accounts/api/keys';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { useAccountBalancePoints } from '@/domains/accounts/hooks/use-account-balance-points';
import { useCashflow } from '@/domains/cashflow/hooks/use-cashflow';
import { Button } from '@/domains/ui-system/components/button';
import { Currency } from '@/domains/ui-system/components/currency';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { Route } from '@/routes/(auth)/route';

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const queryClient = useQueryClient();
  const { data: account } = useAccount(slug);
  const { from, to } = Route.useSearch();
  const { isPending: isLoadingBalancePoints, data: balancePoints } = useAccountBalancePoints(
    slug,
    from ?? '',
    to ?? ''
  );
  const {
    data: cashflowSummary,
    isLoading: isLoadingCashflow,
    error: cashflowError,
  } = useCashflow({
    account_id: slug,
    card_date_basis: 'competence',
    date_from: from,
    date_to: to,
  });

  const refreshAccountBalance = () => {
    void queryClient.invalidateQueries({
      queryKey: GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY(slug, from ?? '', to ?? ''),
    });
  };

  // The invoice payment is ignored on the account, so its cards' purchases
  // are this account's spending too.
  const accountExpenses = cashflowSummary?.total_expenses ?? 0;
  const cardExpenses = cashflowSummary?.card_spending ?? 0;

  const balancePoint = useMemo(() => {
    return balancePoints?.at(-1);
  }, [balancePoints]);

  return (
    <section data-ui="account-overview" className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[16rem_18rem_minmax(0,1fr)]">
        <div
          className="flex min-h-64 flex-col justify-between rounded-2xl bg-spotlight p-5 text-spotlight-foreground"
          data-ui="account-overview-balance"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-white/70">Current balance</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
              disabled={isLoadingBalancePoints}
              onClick={refreshAccountBalance}
              aria-label="Refresh balance"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Currency
              variant="large"
              value={balancePoint?.balance ?? account?.balance}
              currency={account?.currency}
              className="financial-value text-3xl text-white"
            />
            <p className="mt-2 text-xs text-white/55">Updated from recorded balance points</p>
          </div>
        </div>

        <div
          className="min-h-64 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)]"
          data-ui="account-period-summary"
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">Period summary</h2>
            <p className="mt-1 text-xs text-muted-foreground">Recorded activity in this range</p>
          </div>

          {isLoadingCashflow ? (
            <div className="mt-6 space-y-4" data-ui="account-period-summary-loading">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : cashflowError ? (
            <div
              className="mt-6 flex min-h-36 items-center justify-center rounded-xl bg-destructive/5 px-4 text-center text-sm text-destructive"
              data-ui="account-period-summary-error"
            >
              We couldn&apos;t calculate totals for this period.
            </div>
          ) : (
            <dl className="mt-5 divide-y divide-border/70" data-ui="account-period-summary-values">
              <SummaryValue
                label="Income"
                value={cashflowSummary?.total_income ?? 0}
                currency={account?.currency}
                icon={ArrowUpRight}
                color="positive"
              />
              <SummaryValue
                label="Expenses"
                value={accountExpenses + cardExpenses}
                currency={account?.currency}
                icon={ArrowDownRight}
                color="negative"
              />
            </dl>
          )}

          {!isLoadingCashflow && !cashflowError && cardExpenses > 0 ? (
            <dl
              className="mt-3 ml-2 space-y-2 border-l border-border/70 pl-4"
              data-ui="account-period-summary-expenses-breakdown"
            >
              <BreakdownValue
                label="Account"
                value={accountExpenses}
                currency={account?.currency}
              />
              <BreakdownValue
                label="Cards (net, competência)"
                value={cardExpenses}
                currency={account?.currency}
              />
            </dl>
          ) : null}
        </div>

        <div className="min-h-64 rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] lg:col-span-2 xl:col-span-1">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-foreground">Balance history</h2>
            <p className="text-xs text-muted-foreground">Movement across the selected period</p>
          </div>
          <AccountBalancePoints slug={slug} title="" />
        </div>
      </div>
    </section>
  );
};

const SummaryValue = ({ label, value, currency, icon: Icon, color }: SummaryValueProps) => (
  <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
    <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </dt>
    <dd>
      <Currency
        value={value}
        currency={currency}
        color={color}
        className="financial-value text-sm"
      />
    </dd>
  </div>
);

const BreakdownValue = ({ label, value, currency }: BreakdownValueProps) => (
  <div className="flex items-center justify-between gap-3">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd>
      <Currency
        value={value}
        currency={currency}
        className="financial-value text-xs text-muted-foreground"
      />
    </dd>
  </div>
);

export default AccountOverview;

interface AccountOverviewProps {
  slug: string;
}

interface SummaryValueProps {
  label: string;
  value: number;
  currency?: string;
  icon: typeof ArrowUpRight;
  color?: 'positive' | 'negative';
}

interface BreakdownValueProps {
  label: string;
  value: number;
  currency?: string;
}
