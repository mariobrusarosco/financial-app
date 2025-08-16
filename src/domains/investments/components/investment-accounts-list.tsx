import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { TrendingUp, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { Button } from '@/domains/ui-system/components/button';
import { Surface } from '@/domains/global/components/surface';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { Plus } from 'lucide-react';
import type { I_Account } from '@/domains/accounts/types/types-and-interfaces';

const InvestmentAccountCard = ({ account }: { account: I_Account }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Surface
      className="h-32 w-full flex flex-col justify-between hover:bg-accent/50 transition-colors"
      size="sm"
      hoverable
    >
      <Link
        to="/accounts/$slug"
        params={{ slug: account.id }}
        className="flex-1 flex flex-col justify-between h-full"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{account.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">Investment</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Account</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-auto">
          <p className="font-medium text-lg">{formatCurrency(account.balance)}</p>
          {account.description && (
            <p className="text-sm text-muted-foreground truncate">{account.description}</p>
          )}
        </div>
      </Link>
    </Surface>
  );
};

const LoadingState = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Loading investment accounts...</p>
    </div>
  );
};

const EmptyState = () => {
  const { openAccountCreate } = useGlobalUIState();

  return (
    <div className="text-center py-8 space-y-4">
      <p className="text-muted-foreground">No investment accounts found</p>
      <Button onClick={openAccountCreate} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Create Investment Account
      </Button>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  return (
    <div className="text-center py-8">
      <p className="text-destructive">Error loading investment accounts: {error.message}</p>
    </div>
  );
};

export const InvestmentAccountsList = () => {
  const { data: allAccounts, isLoading, error } = useGetAllActiveAccounts();
  const { openAccountCreate } = useGlobalUIState();

  // Filter accounts to show only investment type
  const investmentAccounts = allAccounts?.filter(account => account.type === 'investment') || [];

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Investment Accounts</CardTitle>
            <CardDescription>Your brokerage and investment accounts</CardDescription>
          </div>
          <Button onClick={openAccountCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {investmentAccounts.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentAccounts.map(account => (
              <li key={account.id}>
                <InvestmentAccountCard account={account} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
