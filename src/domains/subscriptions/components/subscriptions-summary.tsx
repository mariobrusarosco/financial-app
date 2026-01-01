import { Wallet, TrendingUp, Repeat, CalendarClock } from 'lucide-react';
import type { I_SubscriptionSummary } from '../types/types-and-interfaces';
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Yearly Projection',
      value: formatValue(summary?.yearly_projection),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Due Next 30 Days',
      value: formatValue(summary?.due_next_30_days),
      icon: CalendarClock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Active Subscriptions',
      value: isLoading ? '...' : (summary?.active_count?.toString() ?? '0'),
      icon: Repeat,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div
      data-ui="subscriptions-summary-section"
      className="bg-section-background rounded-3xl p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="flex-row items-center gap-4 py-6 px-6 shadow-none border-none bg-neutral-white"
          >
            <div className={cn('p-3 rounded-xl', card.bgColor)}>
              <card.icon className={cn('h-6 w-6', card.color)} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <p className="text-2xl font-bold tracking-tight text-primary">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};