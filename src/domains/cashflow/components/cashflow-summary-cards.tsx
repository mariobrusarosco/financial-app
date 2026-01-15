import { Card, CardContent } from '@/domains/ui-system/components/card';
import { TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';

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
  const formatCurrency = (amount: number) => {
    return `$${Intl.NumberFormat('us', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Net Cashflow',
      value: formatCurrency(netCashflow),
      icon: Wallet,
      color: netCashflow >= 0 ? 'text-blue-600' : 'text-rose-600',
      bgColor: netCashflow >= 0 ? 'bg-blue-50' : 'bg-rose-50',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: Percent,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-none border border-border rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
