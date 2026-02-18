import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { BrushCleaning, ChevronRight, RefreshCcw, XCircle, Banknote, CreditCard, ChartBar, Loan } from 'lucide-react';
import { I_Account, T_AccountType } from '@/domains/accounts/types/types-and-interfaces';
import { useAccountBalancePoints } from '../hooks/use-account-balance-points';
import { Route } from '@/routes/(auth)/route';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { Badge } from '@/domains/ui-system/components/badge';
import { cn } from '@/domains/ui-system/utils';


const AccountIcon = ({ type }: { type: T_AccountType }) => {
  switch (type) {
    case 'cash':
      return <Banknote className="h-7 w-7 text bg-teal-700/50 text-neutral-white rounded-md p-2" />;
    case 'investment':
      return <ChartBar className="h-7 w-7 text bg-blue-700/50 text-neutral-white rounded-md p-2" />;
    default:
      return <CreditCard className="h-7 w-7 text bg-red-700/50 text-neutral-white rounded-md p-2" />;
  }
};

const AccountCard = ({ account }: { account: I_Account }) => {
  const { from, to } = Route.useSearch();

  const { isPending: isLoadingBalancePoints, data: balancePoints } = useAccountBalancePoints(
    account.id,
    from ?? '',
    to ?? ''
  );

  const balancePoint = useMemo(() => {
    return balancePoints?.at(-1);
  }, [balancePoints]);

  const brokerprimaryColor = account.broker.colors[0];

  return (
    <div
      data-testid="account-card"
      data-account-id={account.id}
      className="w-full flex flex-col gap-1 justify-between bg-card-background rounded-3xl"
      data-ui="account-card"
    >
      <div className="flex items-start justify-between p-4">
        <div className="w-full overflow-hidden ">
          {' '}
          <h3 data-testid="account-card-name" className="truncate text-ellipsis whitespace-nowrap">
            {account.name}
          </h3>
          <Badge
            data-testid="account-card-broker"
            variant="outline"
            className="bg-primary/20 text-neutral-white text-xs py-1 px-3"
            style={{ backgroundColor: brokerprimaryColor }}
          >
            {account.broker?.name}
          </Badge>
        </div>
        <Link
          data-testid="account-card-link"
          to="/accounts/$slug"
          params={{ slug: account.id }}
          className="text-neutral-white rounded-lg p-2 bg-primary/50"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-b-3xl px-6 py-4 bg-primary/10">
        <p data-testid="account-card-balance" className="font-light text-primary text-2xl">
          {isLoadingBalancePoints ? (
            <Loader2 className="w-7 h-7 animate-spin text-primary transform-origin-center" />
          ) : (
            formatCurrencyAmount(balancePoint?.balance ?? 0)
          )}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div data-testid="accounts-list-loading" className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="p-6 rounded-3xl">
        <RefreshCcw className="h-15 w-15 animate-spin text-muted-foreground/50 stroke-1 transform-origin-center" />
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div data-testid="accounts-list-empty" className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="p-6 bg-muted-foreground/10 rounded-3xl">
        <BrushCleaning className="h-15 w-15 text-muted-foreground stroke-1" />
      </div>
      <p className="text-2xl font-light">You don&apos;t have any accounts yet</p>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  // TODO: move to Sentry
  console.error(error);
  return (
    <div data-testid="accounts-list-error" className="flex flex-col items-center justify-center gap-4 flex-1 h-full">
      <div className="p-6 bg-destructive/10 rounded-3xl">
        <XCircle className="h-15 w-15 text-destructive stroke-1" />
      </div>
      <p className="text-destructive text-2xl font-light">
        Ops! Something went wrong while loading accounts
      </p>
    </div>
  );
};

const AccountsList = () => {
  const { data: accounts, isLoading, error } = useGetAllActiveAccounts();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!accounts || accounts.length === 0) return <EmptyState />;

  const groupedByType = Object.groupBy(accounts, ({ type }) => type);

  return (
    <div data-testid="accounts-list" className="flex flex-col pt-15 gap-10">
      {Object.entries(groupedByType).map(([type, accounts]) => (
        <div key={type} className="w-1/2" data-testid={`accounts-group-${type}`}>
          <div className="flex gap-2 items-center mb-4">
            <AccountIcon type={type} />
            <h2
              className="text-xl font-light text-primary uppercase"
              data-testid={`accounts-group-header-${type}`}
            >
              {type}
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-wrap gap-5 bg-section-background rounded-3xl">
            {accounts.map(account => (
              <li key={account.id}>
                <AccountCard account={account} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AccountsList;
