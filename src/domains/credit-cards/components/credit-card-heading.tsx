import { CreditCard, FileText, TrendingUp } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import type { I_CreditCard } from '@/domains/credit-cards/types/types-and-interfaces';
import { CREDIT_CARD_BRANDS } from '@/domains/credit-cards/types/constants';
import { Currency } from '@/domains/ui-system/components/currency';
import { cn } from '@/domains/ui-system/utils/index';

interface CreditCardHeadingProps {
  creditCard: I_CreditCard | null;
  currency?: string;
}

export const CreditCardHeading = ({ creditCard, currency }: CreditCardHeadingProps) => {
  const pathname = useLocation({ select: location => location.pathname });
  const activeTab = pathname.includes('/invoices') ? 'invoices' : 'transactions';

  const brandLabel =
    creditCard?.brand !== 'other'
      ? CREDIT_CARD_BRANDS.find(brand => brand.value === creditCard?.brand)?.label
      : undefined;

  const metaItems = [
    brandLabel,
    creditCard?.last_four_digits && (
      <span className="tabular-nums">•••• {creditCard.last_four_digits}</span>
    ),
    creditCard?.due_date ? `Due on day ${creditCard.due_date}` : null,
    creditCard?.credit_limit ? (
      <span className="inline-flex items-center gap-1">
        Limit
        <Currency
          value={creditCard.credit_limit}
          currency={currency}
          variant="small"
          color="muted"
          showDecimals={false}
        />
      </span>
    ) : null,
  ].filter(Boolean);

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)] sm:flex-row sm:items-center sm:justify-between"
      data-ui="credit-card-heading"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {creditCard?.name}
          </h1>
          {metaItems.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {metaItems.map((item, index) => (
                <span key={index} className="inline-flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">·</span>}
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav
        className="flex self-start rounded-xl bg-muted p-1 sm:self-auto"
        aria-label="Credit card sections"
      >
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
              aria-current={activeTab === item.value ? 'page' : undefined}
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
