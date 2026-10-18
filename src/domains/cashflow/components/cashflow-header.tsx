import { Link } from '@tanstack/react-router';
import { BarChart3 } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';
import { cn } from '@/domains/ui-system/utils';

type T_CashflowTab = 'overview' | 'expenses';

const TABS: { id: T_CashflowTab; label: string; to: '/cashflow' | '/cashflow/expenses' }[] = [
  { id: 'overview', label: 'Overview', to: '/cashflow' },
  { id: 'expenses', label: 'Expenses', to: '/cashflow/expenses' },
];

interface CashflowHeaderProps {
  activeTab: T_CashflowTab;
  from?: string;
  to?: string;
}

/** Shared header for the Cashflow pages: title, date filter, and Overview | Expenses tabs. */
export const CashflowHeader = ({ activeTab, from, to }: CashflowHeaderProps) => (
  <div className="space-y-4">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <PageHeader title="Cashflow" icon={BarChart3} showAddButton={false} />
      <GlobalDateFilter />
    </div>

    <nav className="flex gap-1 border-b border-border" aria-label="Cashflow sections">
      {TABS.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <Link
            key={tab.id}
            to={tab.to}
            // Keep the selected dates when switching tabs
            search={{ from, to }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-brand text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  </div>
);
