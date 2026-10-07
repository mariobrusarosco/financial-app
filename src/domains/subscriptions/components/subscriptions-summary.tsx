import { Wallet, TrendingUp, Repeat, CalendarClock } from 'lucide-react';
import type { I_SubscriptionSummary } from '@/domains/subscriptions/types/types-and-interfaces';
import { Card } from '@/domains/ui-system/components/card';
import { cn } from '@/domains/ui-system/utils';

interface SubscriptionsSummaryProps {
  summary?: I_SubscriptionSummary;
  isLoading?: boolean;
}

export const SubscriptionsSummary = ({ summary, isLoading }: SubscriptionsSummaryProps) => {
  const formatValue = (value?: number) => {
    if (isLoading || value === undefined) return '...';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const cards = [
    {
      label: 'Monthly Burn Rate',
      value: formatValue(summary?.monthly_burn_rate),
      icon: Wallet,
      color: 'text-brand',
      bgColor: 'bg-pastel-blue',
    },
    {
      label: 'Yearly Projection',
      value: formatValue(summary?.yearly_projection),
      icon: TrendingUp,
      color: 'text-[#a15e48]',
      bgColor: 'bg-pastel-peach',
    },
    {
      label: 'Due Next 30 Days',
      value: formatValue(summary?.due_next_30_days),
      icon: CalendarClock,
      color: 'text-positive',
      bgColor: 'bg-pastel-green',
    },
    {
      label: 'Active Subscriptions',
      value: isLoading ? '...' : (summary?.active_count?.toString() ?? '0'),
      icon: Repeat,
      color: 'text-[#6250c7]',
      bgColor: 'bg-pastel-violet',
    },
  ];

  return (
    <div data-ui="subscriptions-summary-section">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => (
          <Card key={card.label} className="flex-row items-center gap-4 px-5 py-5">
            <div className={cn('p-3 rounded-xl', card.bgColor)}>
              <card.icon className={cn('h-6 w-6', card.color)} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <p className="financial-value text-2xl font-semibold tracking-tight text-foreground">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
