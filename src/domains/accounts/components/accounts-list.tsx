import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { BrushCleaning, ChevronRight, RefreshCcw, XCircle } from 'lucide-react';
import { I_Account } from '@/domains/accounts/types/types-and-interfaces';

const AccountCard = ({ account }: { account: I_Account }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const brokerprimaryColor = account.broker.colors[0];

  return (
    <div
      className="w-full flex flex-col gap-4 justify-between bg-card-background rounded-3xl"
      data-ui="account-card"
    >
      <div className="flex items-start justify-between px-6 py-5">
        <h3 className="text-xl truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {account.name}
        </h3>
        {/* <Badge variant="outline" className="bg-primary/20 text-primary border-none">
            {account.type}
          </Badge> */}
        <Link
          to="/accounts/$slug"
          params={{ slug: account.id }}
          style={{ backgroundColor: brokerprimaryColor }}
          className="text-neutral-white rounded-lg p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-b-3xl px-6 py-8" style={{ backgroundColor: brokerprimaryColor }}>
        <p className="font-light text-neutral-white text-3xl tracking-tight">
          {formatCurrency(account.balance)}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="p-6 rounded-3xl">
        <RefreshCcw className="h-15 w-15 animate-spin text-muted-foreground/50 stroke-1 transform-origin-center" />
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="p-6 bg-muted-foreground/10 rounded-3xl">
        <BrushCleaning className="h-15 w-15 text-muted-foreground stroke-1" />
      </div>
      <p className="text-2xl font-light">You don&apos;t have any accounts yet</p>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1 h-full">
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

  return (
    <ul className="grid grid-cols-1 md:grid-cols- lg:grid-cols-5 gap-3 bg-section-background rounded-3xl p-6">
      {accounts.map(account => (
        <li key={account.id}>
          <AccountCard account={account} />
        </li>
      ))}
    </ul>
  );
};

export default AccountsList;
