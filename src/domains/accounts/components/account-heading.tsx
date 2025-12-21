import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Tabs, TabsTrigger, TabsList } from '@/domains/ui-system/components/tabs';
import { CreditCard, FileText, TrendingUp } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

interface AccountOverviewProps {
  slug: string;
}

const AccountHeading = ({ slug }: AccountOverviewProps) => {
  const { data: account } = useAccount(slug);
  const location = useLocation();

  const activeTab = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.includes('/statements')) return 'statements';
    if (pathname.includes('/credit-card')) return 'credit-cards';
    if (pathname.includes('/expenses')) return 'expenses';
    if (pathname.includes('/income')) return 'income';
    return 'overview';
  }, [location.pathname]);

  return (
    <div className="flex gap-8 items-center flex-1" data-ui="account-heading">
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Bank Account</p>
        <h1 className="text-3xl font-bold tracking-tight">{account?.name}</h1>
      </div>

      <Tabs value={activeTab} className="ml-4">
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
          <Link to="/accounts/$slug/expenses" params={{ slug }}>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Expenses
            </TabsTrigger>
          </Link>
          <Link to="/accounts/$slug/income" params={{ slug }}>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Income
            </TabsTrigger>
          </Link>
          <Link to="/accounts/$slug/credit-card" params={{ slug }}>
            <TabsTrigger value="credit-cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Cards
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AccountHeading;
