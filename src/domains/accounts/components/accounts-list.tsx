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

const AccountCard = ({ account }: { account: I_Account }) => {
  const deleteAccount = useDeleteAccount();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteAccount.mutate(account.id);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Building2 className="h-6 w-6" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6" />;
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      default:
        return <Building2 className="h-6 w-6" />;
    }
  };

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
            <div className="p-2 rounded-full bg-primary/10">{getAccountIcon(account.type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{account.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
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
