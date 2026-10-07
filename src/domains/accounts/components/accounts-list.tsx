import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { BrushCleaning, ChevronRight, XCircle, Banknote, CreditCard, ChartBar } from 'lucide-react';
import { I_Account, T_AccountType } from '@/domains/accounts/types/types-and-interfaces';
import { useAccountBalancePoints } from '@/domains/accounts/hooks/use-account-balance-points';
import { Route } from '@/routes/(auth)/route';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';

const AccountIcon = ({ type }: { type: T_AccountType }) => {
  switch (type) {
    case 'cash':
      return <Banknote className="h-4 w-4" />;
    case 'investment':
      return <ChartBar className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const AccountCard = ({ account }: { account: I_Account }) => {
  const { from, to } = Route.useSearch();
  const hasDateRange = !!from && !!to;

  const { isPending: isLoadingBalancePoints, data: balancePoints } = useAccountBalancePoints(
    account.id,
    from ?? '',
    to ?? ''
  );

  const balanceToDisplay = useMemo(() => {
    if (hasDateRange && balancePoints) {
      return balancePoints.at(-1)?.balance ?? 0;
    }
    return account.balance;
  }, [hasDateRange, balancePoints, account.balance]);

  const brokerprimaryColor = account.broker.colors[0];

  return (
    <div
      data-testid="account-card"
      data-account-id={account.id}
      className="group relative flex min-h-40 w-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-panel)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lg"
      data-ui="account-card"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: brokerprimaryColor }}
      />
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {account.type}
          </p>
          <h3
            data-testid="account-card-name"
            className="truncate text-sm font-semibold text-foreground"
          >
            {account.name}
          </h3>
          <div
            data-testid="account-card-broker"
            className="mt-1 truncate text-xs text-muted-foreground"
          >
            {account.broker?.name}
          </div>
        </div>
        <Link
          data-testid="account-card-link"
          to="/accounts/$slug"
          params={{ slug: account.id }}
          aria-label={`Open ${account.name}`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="border-t border-border/70 bg-muted/35 px-5 py-4">
        <p className="text-[0.65rem] font-medium text-muted-foreground">Current balance</p>
        <p
          data-testid="account-card-balance"
          className="financial-value mt-1 text-2xl font-semibold text-foreground"
        >
          {hasDateRange && isLoadingBalancePoints ? (
            <Loader2 className="w-7 h-7 animate-spin text-primary transform-origin-center" />
          ) : (
            formatCurrencyAmount(balanceToDisplay)
          )}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div
      data-testid="accounts-list-loading"
      className="grid min-h-72 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div
      data-testid="accounts-list-empty"
      className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center"
    >
      <div className="rounded-2xl bg-pastel-blue p-4">
        <BrushCleaning className="h-7 w-7 text-brand" />
      </div>
      <div>
        <p className="font-semibold text-foreground">You don&apos;t have any accounts yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Create one to start tracking balances.</p>
      </div>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  // TODO: move to Sentry
  console.error(error);
  return (
    <div
      data-testid="accounts-list-error"
      className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
    >
      <div className="rounded-2xl bg-destructive/10 p-4">
        <XCircle className="h-7 w-7 text-destructive" />
      </div>
      <p className="font-semibold text-destructive">We couldn&apos;t load your accounts.</p>
    </div>
  );
};

const AccountsList = () => {
  const {
    accounts: { query },
  } = useAccounts({ is_active: true });

  if (query.isLoading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} />;
  if (query.data?.isEmpty) return <EmptyState />;

  return (
    <div data-testid="accounts-list" className="space-y-8">
      {(query.data?.accountGroups ?? []).map(({ type, accounts }) => (
        <section key={type} data-testid={`accounts-group-${type}`}>
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
              <AccountIcon type={type} />
            </span>
            <h2
              className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
              data-testid={`accounts-group-header-${type}`}
            >
              {type}
            </h2>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {accounts.map(account => (
              <li key={account.id}>
                <AccountCard account={account} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default AccountsList;
