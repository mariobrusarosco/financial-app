import { Card, CardContent } from '@/domains/ui-system/components/card';
import {
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import type { I_CashflowSummary } from '@/domains/cashflow/types/index';
import { formatCashflowCurrency } from '@/domains/cashflow/utils/cashflow-formatting';
import { getPercentChange } from '@/domains/cashflow/utils/cashflow-periods';

interface CashflowSummaryCardsProps {
  summary: I_CashflowSummary;
  // Previous period, for the "vs …" comparison line (omit to hide it)
  previousSummary?: I_CashflowSummary;
  comparisonLabel?: string;
  // One card per row on large screens (for a narrow side column)
  stacked?: boolean;
}

// Whether an increase is good news for this metric (drives the comparison color)
type T_Direction = 'up-is-good' | 'up-is-bad';
const UP_IS_GOOD: T_Direction = 'up-is-good';
const UP_IS_BAD: T_Direction = 'up-is-bad';
const NEGATIVE_COLOR = 'text-destructive';
const NEGATIVE_BG = 'bg-pastel-peach';

export const CashflowSummaryCards = ({
  summary,
  previousSummary,
  comparisonLabel,
  stacked = false,
}: CashflowSummaryCardsProps) => {
  const hasIncome = summary.total_income > 0;
  const hadIncome = (previousSummary?.total_income ?? 0) > 0;

  const cards = [
    {
      title: 'Income',
      value: formatCashflowCurrency(summary.total_income),
      change: previousSummary
        ? formatPercentChange(summary.total_income, previousSummary.total_income)
        : undefined,
      direction: UP_IS_GOOD,
      delta: previousSummary ? summary.total_income - previousSummary.total_income : 0,
      icon: TrendingUp,
      color: 'text-positive',
      bgColor: 'bg-pastel-green',
    },
    {
      title: 'Expenses',
      value: formatCashflowCurrency(summary.total_expenses),
      change: previousSummary
        ? formatPercentChange(summary.total_expenses, previousSummary.total_expenses)
        : undefined,
      direction: UP_IS_BAD,
      delta: previousSummary ? summary.total_expenses - previousSummary.total_expenses : 0,
      icon: TrendingDown,
      color: NEGATIVE_COLOR,
      bgColor: NEGATIVE_BG,
    },
    {
      title: 'Net',
      value: formatCashflowCurrency(summary.net_cashflow),
      change: previousSummary
        ? formatPercentChange(summary.net_cashflow, previousSummary.net_cashflow)
        : undefined,
      direction: UP_IS_GOOD,
      delta: previousSummary ? summary.net_cashflow - previousSummary.net_cashflow : 0,
      icon: Wallet,
      color: summary.net_cashflow >= 0 ? 'text-brand' : NEGATIVE_COLOR,
      bgColor: summary.net_cashflow >= 0 ? 'bg-pastel-blue' : NEGATIVE_BG,
    },
    {
      title: 'Savings rate',
      // A rate means nothing without income
      value: hasIncome ? `${summary.savings_rate.toFixed(1)}%` : '—',
      change:
        previousSummary && hasIncome && hadIncome
          ? formatPointsChange(summary.savings_rate - previousSummary.savings_rate)
          : undefined,
      direction: UP_IS_GOOD,
      delta: previousSummary ? summary.savings_rate - previousSummary.savings_rate : 0,
      icon: Percent,
      color: hasIncome ? 'text-brand' : 'text-muted-foreground',
      bgColor: 'bg-pastel-violet',
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2',
        stacked ? 'lg:grid-cols-1' : 'xl:grid-cols-4'
      )}
    >
      {cards.map(card => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="space-y-1 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div className={cn('rounded-lg p-1.5', card.bgColor)}>
                <card.icon className={cn('h-3.5 w-3.5', card.color)} />
              </div>
            </div>
            <div className={cn('financial-value text-2xl font-semibold', card.color)}>
              {card.value}
            </div>
            {comparisonLabel && (
              <ComparisonLine
                change={card.change}
                delta={card.delta}
                direction={card.direction}
                label={comparisonLabel}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ComparisonLine = ({
  change,
  delta,
  direction,
  label,
}: {
  change?: string;
  delta: number;
  direction: T_Direction;
  label: string;
}) => {
  if (!change) {
    return <p className="text-xs text-muted-foreground">— {label}</p>;
  }

  const isUp = delta > 0;
  const isGood = delta === 0 || (direction === 'up-is-good' ? isUp : !isUp);
  const Arrow = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <span
        className={cn(
          'inline-flex items-center gap-0.5 font-medium',
          isGood ? 'text-positive' : NEGATIVE_COLOR
        )}
      >
        {delta !== 0 && <Arrow className="h-3 w-3" />}
        {change}
      </span>
      {label}
    </p>
  );
};

const formatPercentChange = (current: number, previous: number) => {
  const change = getPercentChange(current, previous);
  return change === undefined ? undefined : `${Math.abs(change).toFixed(0)}%`;
};

const formatPointsChange = (points: number) => `${Math.abs(points).toFixed(1)} pts`;
