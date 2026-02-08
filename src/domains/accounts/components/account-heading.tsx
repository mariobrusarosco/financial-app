import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Tabs, TabsTrigger, TabsList } from '@/domains/ui-system/components/tabs';
import { CreditCard, FileText, TrendingUp } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { cn } from '@/domains/ui-system/utils';
import React from 'react';

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
    <div className="flex gap-30 items-center flex-1" data-ui="account-heading">
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Bank Account</p>
        <h1 className="text-3xl font-bold tracking-tight">{account?.name}</h1>
      </div>

      <Tabs value={activeTab} className="ml-4">
        <TabsList className="flex gap-3 bg-primary rounded-md p-1 h-fit">
          <Link to="/accounts/$slug" params={{ slug }} >
            <AccountHeadingTab
              value="overview"
              label="Overview"
              icon={<TrendingUp className="h-4 w-4" />}
              activeTab={activeTab}
            />
          </Link>
          <Link to="/accounts/$slug/statements" params={{ slug }}>
            <AccountHeadingTab
              value="statements"
              label="Statements"
              icon={<FileText className="h-4 w-4" />}
              activeTab={activeTab}
            />
          </Link>
          <Link to="/accounts/$slug/expenses" params={{ slug }}>
            <AccountHeadingTab
              value="expenses"
              label="Expenses"
              icon={<TrendingUp className="h-4 w-4" />}
              activeTab={activeTab}
            />
          </Link>
          <Link to="/accounts/$slug/income" params={{ slug }}>
            <AccountHeadingTab
              value="income"
              label="Income"
              icon={<TrendingUp className="h-4 w-4" />}
              activeTab={activeTab}
            />
          </Link>
          <Link to="/accounts/$slug/credit-card" params={{ slug }}>
            <AccountHeadingTab
              value="credit-cards"
              label="Credit Cards"
              icon={<CreditCard className="h-4 w-4" />}
              activeTab={activeTab}
            />
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};

interface AccountHeadingTabProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  activeTab: string;
}

const AccountHeadingTab = ({ value, label, icon, activeTab }: AccountHeadingTabProps) => {
  return (
    <TabsTrigger value={value} className={cn(
      'text-xs px-2 py-2.5 rounded-md cursor-pointer text-neutral-white hover:bg-foreground hover:text-primary',
      activeTab === value && 'bg-neutral-white text-primary',
      activeTab !== value && 'text-neutral-white'
    )}>
      {icon}
      {label}
    </TabsTrigger>
  );
};

export default AccountHeading;
