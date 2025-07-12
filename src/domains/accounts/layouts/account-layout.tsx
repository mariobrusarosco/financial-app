import { Outlet, useLocation, Link } from '@tanstack/react-router';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Tabs, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';

import { Button } from '@/domains/ui-system/components/button';
import { ArrowLeft, FileText, CreditCard, TrendingUp } from 'lucide-react';
import AccountOverview from '@/domains/accounts/components/account-overview';
import AccountQuickActions from '@/domains/accounts/components/account-quick-actions';

interface AccountLayoutProps {
  slug: string;
}

export const AccountLayout = ({ slug }: AccountLayoutProps) => {
  const location = useLocation();
  const { data: account, isLoading, error } = useAccount(slug);

  // Determine active tab based on current route
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes('/statements')) return 'statements';
    if (pathname.includes('/credit-card')) return 'credit-cards';
    return 'overview';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{account?.name}</h1>
          <p className="text-muted-foreground">
            {account?.type} account • {account?.broker?.name}
          </p>
        </div>
        <Link to="/accounts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountOverview slug={slug} />
        <AccountQuickActions />
      </div>

      <Tabs value={getActiveTab()} className="space-y-4">
        <TabsList>
          <Link to="/accounts/$slug" params={{ slug }}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </Link>
          <Link to="/accounts/$slug/statements" params={{ slug }}>
            <TabsTrigger value="statements" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Statements
            </TabsTrigger>
          </Link>
          <Link to="/accounts/$slug/credit-card" params={{ slug }}>
            <TabsTrigger value="credit-cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Cards
            </TabsTrigger>
          </Link>
        </TabsList>

        {/* Route content renders here */}
        <div className="mt-6">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};
