import { Outlet, useLocation, Link } from '@tanstack/react-router';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Tabs, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import {
  ArrowLeft,
  FileText,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

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
      {/* Header */}
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

      {/* Account Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Current account balance and details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold text-primary">
                {account?.currency} {account?.balance?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currency</p>
              <p className="text-lg font-semibold">{account?.currency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-lg font-semibold capitalize">{account?.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Broker</p>
              <p className="text-lg font-semibold">{account?.broker?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common account actions and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <ArrowUpRight className="h-5 w-5 mb-2 text-green-600" />
              <span className="font-semibold">Add Deposit</span>
              <span className="text-sm text-muted-foreground">Record new funds</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <ArrowDownRight className="h-5 w-5 mb-2 text-red-600" />
              <span className="font-semibold">Record Withdrawal</span>
              <span className="text-sm text-muted-foreground">Track outgoing funds</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingUp className="h-5 w-5 mb-2 text-blue-600" />
              <span className="font-semibold">View Analytics</span>
              <span className="text-sm text-muted-foreground">Performance insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Route-Integrated Tabs */}
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
