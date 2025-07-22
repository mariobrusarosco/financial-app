import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';
import { Surface } from '@/domains/ui-system/components/surface';
import { Building2, PiggyBank, CreditCard, MoreVertical } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';

function AccountsList() {
  const { data: accounts, isLoading, error } = useGetAllActiveAccounts();

  if (isLoading) return <p>Loading accounts...</p>;
  if (error) return <p>Error fetching accounts: {error.message}</p>;
  if (!accounts || accounts.length === 0) return <p>No active accounts found.</p>;

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
    <Surface variant="muted" size="lg" className="p-6">
      <div className="space-y-4">
          {accounts.map(account => (
            <div
              key={account.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Link
                to="/accounts/$slug"
                params={{ slug: account.id }}
                className="flex items-center space-x-4 flex-1"
              >
                <div className="p-2 rounded-full bg-primary/10">{getAccountIcon(account.type)}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(account.balance)}</p>
                  {account.type === 'credit' && (
                    <p className="text-sm text-muted-foreground">
                      Available: {formatCurrency(account.availableCredit || 0)}
                    </p>
                  )}
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
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
          ))}
        </div>
      </Surface>
  );
}

export default AccountsList;
