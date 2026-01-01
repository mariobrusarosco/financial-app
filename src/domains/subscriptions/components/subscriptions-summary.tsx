import { Wallet, TrendingUp, Repeat, CalendarClock } from 'lucide-react';
import type { I_Subscription } from '../types/types-and-interfaces';
import {
  calculateMonthlyBurnRate,
  calculateYearlyProjection,
  calculateDueNext30Days,
} from '../utils/subscription-calculators';
import { Card } from '@/domains/ui-system/components/card';
import { cn } from '@/domains/ui-system/utils';

interface SubscriptionsSummaryProps {
  subscriptions: I_Subscription[];
}

export const SubscriptionsSummary = ({ subscriptions }: SubscriptionsSummaryProps) => {
  const monthlyBurn = calculateMonthlyBurnRate(subscriptions);
  const yearlyProjection = calculateYearlyProjection(subscriptions);
  const dueNext30Days = calculateDueNext30Days(subscriptions);
  const activeCount = subscriptions.filter((s) => s.is_active).length;

  const cards = [
    {
      label: 'Monthly Burn Rate',
      value: monthlyBurn.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Yearly Projection',
      value: yearlyProjection.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Due Next 30 Days',
      value: dueNext30Days.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: CalendarClock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Active Subscriptions',
      value: activeCount.toString(),
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
