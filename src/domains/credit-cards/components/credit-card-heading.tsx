import { FileText, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { I_CreditCard } from '@/domains/credit-cards/types/types-and-interfaces';
import { cn } from '@/domains/ui-system/utils/index';

interface CreditCardHeadingProps {
  creditCard: I_CreditCard | null;
}

export const CreditCardHeading = ({ creditCard }: CreditCardHeadingProps) => {
  const activeTab = useMemo(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/invoices')) return 'invoices';
    if (pathname.includes('/transactions')) return 'transactions';
    return 'transactions';
  }, []);

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)] sm:flex-row sm:items-end sm:justify-between"
      data-ui="credit-card-heading"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Credit Card</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-foreground">
          {creditCard?.name}
        </h1>
      </div>

      <nav className="flex rounded-xl bg-muted p-1" aria-label="Credit card sections">
        {[
          {
            value: 'transactions',
            label: 'Transactions',
            icon: TrendingUp,
            href: '/accounts/$slug/credit-card/$creditCardId/transactions' as const,
          },
          {
            value: 'invoices',
            label: 'Invoices',
            icon: FileText,
            href: '/accounts/$slug/credit-card/$creditCardId/invoices' as const,
          },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.value}
              to={item.href}
              params={{ slug: creditCard?.account_id || '', creditCardId: creditCard?.id || '' }}
              className={cn(
                'inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                activeTab === item.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
