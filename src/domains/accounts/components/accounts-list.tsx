import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useDeleteAccount } from '@/domains/accounts/hooks/use-delete-account';
import { Link } from '@tanstack/react-router';
import { Building2, PiggyBank, CreditCard, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { I_Account } from '@/domains/accounts/types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Surface } from '@/domains/global/components/surface';
import { cn } from '@/domains/ui-system/utils';
import { Badge } from '@/domains/ui-system/components/badge';

const getMovementBadge = (type: string) => {
  switch (type) {
    case 'cash':
      return (
        <Badge variant="outline" className="bg-green-200 text-green-700 border-none">
          Cash
        </Badge>
      );
    case 'savings':
      return <Badge variant="outline">Savings</Badge>;
    case 'credit':
      return <Badge variant="outline">Credit</Badge>;
    default:
      return <Badge variant="outline">Account</Badge>;
  }
};

const AccountCard = ({ account }: { account: I_Account }) => {
  const deleteAccount = useDeleteAccount();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteAccount.mutate(account.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Surface
      data-ui="account-card"
      className="h-32 w-full flex flex-col justify-between hover:bg-accent/50 transition-colors rounded-sm"
      size="sm"
      hoverable
    >
      <Link
        to="/accounts/$slug"
        params={{ slug: account.id }}
        className="flex-1 flex flex-col justify-between h-full"
      >
        <div className="flex items-start justify-between font-light ">
          <div className="flex items-center space-x-2">
            <div className="flex-1 min-w-0 max-w-[120px]">
              <h3 className="text-lg truncate overflow-hidden text-ellipsis whitespace-nowrap">
                {account.name}
              </h3>
              {getMovementBadge(account.type)}
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
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-auto">
          <p className="font-medium text-lg">{formatCurrency(account.balance)}</p>
          {account.type === 'credit' && (
            <p className="text-sm text-muted-foreground">
              Available: {formatCurrency(account.availableCredit || 0)}
            </p>
          )}
        </div>
      </Link>
    </Surface>
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
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map(account => (
        <li key={account.id}>
          <AccountCard account={account} />
        </li>
      ))}
    </ul>
  );
};

export default AccountsList;
