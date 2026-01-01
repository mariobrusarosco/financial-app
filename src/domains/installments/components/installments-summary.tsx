import { CreditCard, TrendingUp, Layers, CalendarCheck } from 'lucide-react';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';
import { calculateTotalOutstandingDebt, calculateNextMonthLiability, calculateCurrentMonthLiability } from '../utils/installment-calculators';
import { Card } from '@/domains/ui-system/components/card';
import { cn } from '@/domains/ui-system/utils';

interface InstallmentsSummaryProps {
  plans: I_InstallmentPlan[];
}

export const InstallmentsSummary = ({ plans }: InstallmentsSummaryProps) => {
  const totalOutstanding = calculateTotalOutstandingDebt(plans);
  const currentMonthLiability = calculateCurrentMonthLiability(plans);
  const nextMonthLiability = calculateNextMonthLiability(plans);
  const activePlansCount = plans.filter(p => p.status === 'active').length;

  const cards = [
    {
      label: 'Due This Month',
      value: currentMonthLiability.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Due Next Month',
      value: nextMonthLiability.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Total Outstanding',
      value: totalOutstanding.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Active Plans',
      value: activePlansCount.toString(),
      icon: Layers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div 
      data-ui="installments-summary-section"
      className="bg-section-background rounded-3xl p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="flex-row items-center gap-4 py-6 px-6 shadow-none border-none bg-neutral-white"
          >
            <div className={cn("p-3 rounded-xl", card.bgColor)}>
              <card.icon className={cn("h-6 w-6", card.color)} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <p className="text-2xl font-bold tracking-tight text-primary">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
