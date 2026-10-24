import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { useAccountExpenses } from '@/domains/accounts/hooks/use-account-expenses';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/domains/ui-system/components/chart';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { cn } from '@/domains/ui-system/utils';
import { formatCompactCurrency, formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { Route } from '@/routes/(auth)/route';
import type {
  I_AccountExpensesCharts,
  I_ExpensesBucket,
  I_ExpensesByTag,
} from '@/domains/accounts/utils/expense-charts';

// Expenses wear the expense color used across the app; "No tag" is the muted one
const chartConfig = {
  total: {
    label: 'Spent',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const TAG_ROW_HEIGHT = 32;
const MAX_TAG_NAME_LENGTH = 14;

export const AccountExpensesCharts = ({ slug }: AccountExpensesChartsProps) => {
  const { from, to } = Route.useSearch();
  const { data: account } = useAccount(slug);
  const {
    expenses: { query },
  } = useAccountExpenses(slug, from, to);
  const currency = account?.currency;

  if (query.isPending) {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (query.error) {
    return (
      <ChartCard title="Spending" description="Expenses in this range">
        <p className="flex h-56 items-center justify-center text-sm text-destructive">
          We couldn&apos;t load the expenses for this period.
        </p>
      </ChartCard>
    );
  }

  if (query.data.count === 0) {
    return (
      <ChartCard title="Spending" description="Expenses in this range">
        <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No expenses in this period.
        </p>
      </ChartCard>
    );
  }

  return (
    <section
      data-ui="account-expenses-charts"
      className={cn(
        'grid gap-4 transition-opacity xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
        query.isPlaceholderData && 'opacity-60'
      )}
    >
      <SpendingOverTime charts={query.data} currency={currency} />
      <SpendingByTag charts={query.data} currency={currency} />
    </section>
  );
};

const SpendingOverTime = ({ charts, currency }: ChartProps) => {
  const peak = Math.max(...charts.buckets.map(bucket => bucket.total));

  return (
    <ChartCard
      title={charts.grouping === 'day' ? 'Spending by day' : 'Spending by month'}
      description="Credit card purchases included. Ignored transactions are left out."
      aside={
        <div className="text-right">
          <p className="financial-value text-lg font-semibold text-foreground">
            {formatCurrencyAmount(charts.total, { currency })}
          </p>
          <p className="text-xs text-muted-foreground">
            {charts.count} {charts.count === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="aspect-auto min-h-56 w-full flex-1">
        <BarChart accessibilityLayer data={charts.buckets} margin={{ top: 20, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
          <YAxis
            width={64}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCompactCurrency(value, { currency })}
          />
          <ChartTooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(_label, payload) =>
                  (payload[0]?.payload as I_ExpensesBucket | undefined)?.title
                }
                formatter={(value, _name, item) => (
                  <SpentTooltipRows
                    total={value as number}
                    count={(item.payload as I_ExpensesBucket).count}
                    currency={currency}
                  />
                )}
              />
            }
          />
          <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {/* Only the biggest bar carries its value; the axis and tooltip cover the rest */}
            <LabelList
              dataKey="total"
              content={({ viewBox, value }) => {
                if (peak <= 0 || Number(value) !== peak) return null;
                const {
                  x = 0,
                  y = 0,
                  width = 0,
                } = viewBox as {
                  x?: number;
                  y?: number;
                  width?: number;
                };

                return (
                  <text
                    x={x + width / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-medium"
                  >
                    {formatCompactCurrency(peak, { currency })}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};

const SpendingByTag = ({ charts, currency }: ChartProps) => {
  return (
    <ChartCard title="Spending by tag" description="A transaction with two tags counts in both.">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto w-full"
        style={{ height: charts.tags.length * TAG_ROW_HEIGHT }}
      >
        <BarChart
          accessibilityLayer
          data={charts.tags}
          layout="vertical"
          margin={{ top: 0, right: 72, bottom: 0, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={104}
            interval={0}
            tickLine={false}
            axisLine={false}
            tickFormatter={shortenTagName}
          />
          <ChartTooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(_label, payload) =>
                  (payload[0]?.payload as I_ExpensesByTag | undefined)?.name
                }
                formatter={(value, _name, item) => (
                  <SpentTooltipRows
                    total={value as number}
                    count={(item.payload as I_ExpensesByTag).count}
                    currency={currency}
                  />
                )}
              />
            }
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={16}>
            {charts.tags.map(tag => (
              <Cell key={tag.id ?? 'no-tag'} fill={colorOfTag(tag)} />
            ))}
            <LabelList
              dataKey="total"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={11}
              formatter={(value: number) => formatCompactCurrency(value, { currency })}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      {charts.hiddenTagsCount > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {charts.hiddenTagsCount} more {charts.hiddenTagsCount === 1 ? 'tag' : 'tags'} not shown
        </p>
      )}
    </ChartCard>
  );
};

const colorOfTag = (tag: I_ExpensesByTag) =>
  tag.id === null ? 'var(--chart-5)' : 'var(--color-total)';

const shortenTagName = (name: string) =>
  name.length > MAX_TAG_NAME_LENGTH ? `${name.slice(0, MAX_TAG_NAME_LENGTH - 1)}…` : name;

const SpentTooltipRows = ({
  total,
  count,
  currency,
}: {
  total: number;
  count: number;
  currency?: string;
}) => (
  <div className="grid w-full gap-1">
    <div className="flex items-center justify-between gap-8">
      <span className="text-muted-foreground">Spent</span>
      <span className="font-mono font-semibold text-foreground">
        {formatCurrencyAmount(total, { currency })}
      </span>
    </div>
    <div className="flex items-center justify-between gap-8">
      <span className="text-muted-foreground">Expenses</span>
      <span className="font-mono text-foreground">{count}</span>
    </div>
  </div>
);

const ChartCard = ({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)]">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {aside}
    </div>
    {children}
  </div>
);

interface AccountExpensesChartsProps {
  slug: string;
}

interface ChartProps {
  charts: I_AccountExpensesCharts;
  currency?: string;
}
