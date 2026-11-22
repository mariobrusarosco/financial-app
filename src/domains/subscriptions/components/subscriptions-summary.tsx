import { Wallet, TrendingUp, Repeat, CalendarClock } from 'lucide-react';
import type { I_SubscriptionSummary } from '@/domains/subscriptions/types/types-and-interfaces';
import { MoneyValue } from '@/domains/ui-system/components/money-value';
import { StatTile } from '@/domains/ui-system/components/stat-tile';

interface SubscriptionsSummaryProps {
  summary?: I_SubscriptionSummary;
  isLoading?: boolean;
}

export const SubscriptionsSummary = ({ summary, isLoading }: SubscriptionsSummaryProps) => {
  const tiles = [
    {
      label: 'Monthly burn rate',
      value: <MoneyValue amount={summary?.monthly_burn_rate ?? 0} />,
      icon: Wallet,
    },
    {
      label: 'Yearly projection',
      value: <MoneyValue amount={summary?.yearly_projection ?? 0} />,
      icon: TrendingUp,
    },
    {
      label: 'Due next 30 days',
      value: <MoneyValue amount={summary?.due_next_30_days ?? 0} />,
      icon: CalendarClock,
    },
    {
      label: 'Active subscriptions',
      value: summary?.active_count?.toString() ?? '0',
      icon: Repeat,
    },
  ];

  return (
    <div data-ui="subscriptions-summary-section">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(tile => (
          <StatTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={tile.icon}
            isLoading={isLoading || !summary}
          />
        ))}
      </div>
    </div>
  );
};
