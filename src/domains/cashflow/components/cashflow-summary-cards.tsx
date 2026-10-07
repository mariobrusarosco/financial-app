import { Card, CardContent } from '@/domains/ui-system/components/card';
import { TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';

interface CashflowSummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
  savingsRate: number;
}

export const CashflowSummaryCards = ({
  totalIncome,
  totalExpenses,
  netCashflow,
  savingsRate,
}: CashflowSummaryCardsProps) => {
  const cards = [
    {
      title: 'Total Income',
      value: formatCurrencyAmount(totalIncome),
      icon: TrendingUp,
      color: 'text-positive',
      bgColor: 'bg-pastel-green',
    },
    {
      title: 'Total Expenses',
      value: formatCurrencyAmount(totalExpenses),
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-pastel-peach',
    },
    {
      title: 'Net Cashflow',
      value: formatCurrencyAmount(netCashflow),
      icon: Wallet,
      color: netCashflow >= 0 ? 'text-brand' : 'text-destructive',
      bgColor: netCashflow >= 0 ? 'bg-pastel-blue' : 'bg-pastel-peach',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: Percent,
      color: 'text-[#6250c7]',
      bgColor: 'bg-pastel-violet',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className={`financial-value text-2xl font-semibold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
