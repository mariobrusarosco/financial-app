import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parse } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import type { I_MonthlyCashflow } from '@/domains/cashflow/types/index';
import {
  formatCashflowCurrency,
  formatCompactCashflowCurrency,
} from '@/domains/cashflow/utils/cashflow-formatting';
import { isMonthInPeriod } from '@/domains/cashflow/utils/cashflow-periods';

const INCOME_COLOR = 'var(--chart-1)';
const EXPENSES_COLOR = 'var(--chart-4)';
// Months outside the selected period are dimmed, so the selection stands out
const DIMMED_OPACITY = 0.35;

interface CashflowChartProps {
  // One entry per month ('yyyy-MM'), e.g. the last 6 months
  data: I_MonthlyCashflow[];
  // The selected period, highlighted in the chart
  from?: string;
  to?: string;
}

export const CashflowChart = ({ data, from, to }: CashflowChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-primary font-semibold">Income vs Expenses</CardTitle>
        <CardDescription>
          Last {data.length} months. The selected period is highlighted.
        </CardDescription>
      </CardHeader>

      {/* Fixed height when stacked; on large screens it fills the row next to the cards */}
      <CardContent className="h-[320px] w-full pt-4 lg:h-auto lg:min-h-[320px] lg:flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickFormatter={(monthKey: string) => formatMonthLabel(monthKey)}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatCompactCashflowCurrency}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
              content={<CashflowTooltip />}
            />
            <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
            {(['income', 'expenses'] as const).map(dataKey => (
              <Bar
                key={dataKey}
                name={dataKey === 'income' ? 'Income' : 'Expenses'}
                dataKey={dataKey}
                fill={dataKey === 'income' ? INCOME_COLOR : EXPENSES_COLOR}
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              >
                {data.map(month => (
                  <Cell
                    key={month.month}
                    fillOpacity={isMonthInPeriod(month.month, from, to) ? 1 : DIMMED_OPACITY}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface I_TooltipEntry {
  dataKey?: string | number;
  payload?: I_MonthlyCashflow;
}

const CashflowTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: I_TooltipEntry[];
  label?: string;
}) => {
  const month = payload?.[0]?.payload;
  if (!active || !month) return null;

  // Read values by name instead of position, so bar order doesn't matter
  const net = month.income - month.expenses;

  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold">{label ? formatMonthLabel(label, true) : ''}</p>
      <TooltipLine label="Income" value={month.income} className="text-positive" />
      <TooltipLine label="Expenses" value={month.expenses} className="text-destructive" />
      <div className="mt-2 border-t border-border pt-2">
        <TooltipLine
          label="Net"
          value={net}
          className={net >= 0 ? 'text-positive' : 'text-destructive'}
        />
      </div>
    </div>
  );
};

const TooltipLine = ({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn('text-sm font-semibold', className)}>{formatCashflowCurrency(value)}</span>
  </div>
);

// 'yyyy-MM' → "Oct" (axis) or "October 2026" (tooltip)
const formatMonthLabel = (monthKey: string, isLong = false) => {
  const date = parse(monthKey, 'yyyy-MM', new Date());
  return Number.isNaN(date.getTime()) ? monthKey : format(date, isLong ? 'MMMM yyyy' : 'MMM');
};
