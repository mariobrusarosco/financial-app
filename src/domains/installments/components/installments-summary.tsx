import { CreditCard, TrendingUp, Layers, CalendarCheck } from 'lucide-react';
import type { I_InstallmentPlan } from '@/domains/installments/types/types-and-interfaces';
import {
  calculateTotalOutstandingDebt,
  calculateNextMonthLiability,
  calculateCurrentMonthLiability,
} from '@/domains/installments/utils/installment-calculators';
import { MoneyValue } from '@/domains/ui-system/components/money-value';
import { StatTile } from '@/domains/ui-system/components/stat-tile';

interface InstallmentsSummaryProps {
  plans: I_InstallmentPlan[];
}

export const InstallmentsSummary = ({ plans }: InstallmentsSummaryProps) => {
  const totalOutstanding = calculateTotalOutstandingDebt(plans);
  const currentMonthLiability = calculateCurrentMonthLiability(plans);
  const nextMonthLiability = calculateNextMonthLiability(plans);
  const activePlansCount = plans.filter(p => p.status === 'active').length;

  const tiles = [
    {
      label: 'Due this month',
      value: <MoneyValue amount={currentMonthLiability} />,
      icon: CalendarCheck,
    },
    {
      label: 'Due next month',
      value: <MoneyValue amount={nextMonthLiability} />,
      icon: TrendingUp,
    },
    {
      label: 'Total outstanding',
      value: <MoneyValue amount={totalOutstanding} />,
      icon: CreditCard,
    },
    { label: 'Active plans', value: activePlansCount.toString(), icon: Layers },
  ];

  return (
    <div data-ui="installments-summary-section">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(tile => (
          <StatTile key={tile.label} label={tile.label} value={tile.value} icon={tile.icon} />
        ))}
      </div>
    </div>
  );
};
