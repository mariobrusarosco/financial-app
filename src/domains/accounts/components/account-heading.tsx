import { Link, useLocation } from '@tanstack/react-router';
import {
  ArrowLeft,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import AccountQuickActions from '@/domains/accounts/components/account-quick-actions';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { cn } from '@/domains/ui-system/utils/index';

interface AccountHeadingProps {
  slug: string;
}

const accountTabs = [
  { label: 'Overview', href: '/accounts/$slug', icon: LayoutDashboard, match: 'overview' },
  { label: 'Statements', href: '/accounts/$slug/statements', icon: FileText, match: 'statements' },
  { label: 'Expenses', href: '/accounts/$slug/expenses', icon: TrendingDown, match: 'expenses' },
  { label: 'Income', href: '/accounts/$slug/income', icon: TrendingUp, match: 'income' },
  {
    label: 'Credit cards',
    href: '/accounts/$slug/credit-card',
    icon: CreditCard,
    match: 'credit-card',
  },
  { label: 'Settings', href: '/accounts/$slug/settings', icon: Settings, match: 'settings' },
] as const;

const AccountHeading = ({ slug }: AccountHeadingProps) => {
  const { data: account } = useAccount(slug);
  const location = useLocation();

  const isTabActive = (match: string) => {
    if (match === 'overview') return location.pathname.endsWith(`/accounts/${slug}`);
    if (match === 'settings') {
      return location.pathname.includes('/settings') || location.pathname.includes('/setttings');
    }
    return location.pathname.includes(`/${match}`);
  };

  return (
    <header
      className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)]"
      data-ui="account-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/accounts"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All accounts
          </Link>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {account?.broker?.name ?? 'Bank account'}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {account?.name}
          </h1>
        </div>

        <AccountQuickActions />
      </div>

      <nav
        className="mt-6 flex gap-1 overflow-x-auto border-t border-border/70 pt-4"
        aria-label="Account sections"
      >
        {accountTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.match);

          return (
            <Link
              key={tab.label}
              to={tab.href}
              params={{ slug }}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default AccountHeading;
