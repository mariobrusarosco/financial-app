import { CreditCard, TrendingUp, Layers, CalendarCheck } from 'lucide-react';
import type { I_InstallmentPlan } from '@/domains/installments/types/types-and-interfaces';
import {
  calculateTotalOutstandingDebt,
  calculateNextMonthLiability,
  calculateCurrentMonthLiability,
} from '@/domains/installments/utils/installment-calculators';
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
      value: currentMonthLiability.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: CalendarCheck,
      color: 'text-positive',
      bgColor: 'bg-pastel-green',
    },
    {
      label: 'Due Next Month',
      value: nextMonthLiability.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: TrendingUp,
      color: 'text-[#a15e48]',
      bgColor: 'bg-pastel-peach',
    },
    {
      label: 'Total Outstanding',
      value: totalOutstanding.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: CreditCard,
      color: 'text-brand',
      bgColor: 'bg-pastel-blue',
    },
    {
      label: 'Active Plans',
      value: activePlansCount.toString(),
      icon: Layers,
      color: 'text-[#6250c7]',
      bgColor: 'bg-pastel-violet',
    },
  ];

  return (
    <div data-ui="installments-summary-section">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => (
          <Card key={card.label} className="flex-row items-center gap-4 px-5 py-5">
            <div className={cn('rounded-xl p-3', card.bgColor)}>
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
