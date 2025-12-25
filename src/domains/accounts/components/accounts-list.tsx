import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { I_Account } from '@/domains/accounts/types/types-and-interfaces';
// import { Badge } from '@/domains/ui-system/components/badge';

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
        <div className="">
          <h3 className="text-xl truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {account.name}
          </h3>
          {/* <Badge variant="outline" className="bg-primary/20 text-primary border-none">
            {account.type}
          </Badge> */}
        </div>
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
    <div className="text-center py-8">
      <p className="text-muted-foreground">Loading accounts...</p>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No active accounts found</p>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  return (
    <div className="text-center py-8">
      <p className="text-destructive">Error loading accounts: {error.message}</p>
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
