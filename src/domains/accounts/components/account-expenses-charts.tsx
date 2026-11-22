import { useState } from 'react';
import type { ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight, CreditCard, Landmark } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { useAccountExpenses } from '@/domains/accounts/hooks/use-account-expenses';
import { Button } from '@/domains/ui-system/components/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/domains/ui-system/components/chart';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { cn } from '@/domains/ui-system/utils';
import { formatCompactCurrency, formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { TagBadge } from '@/domains/tags/components/tag-badge';
import { Route } from '@/routes/(auth)/route';
import type {
  I_AccountExpensesCharts,
  I_ExpensesBucket,
  I_ExpensesByTag,
} from '@/domains/accounts/utils/expense-charts';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

// Expenses wear the expense color used across the app
const chartConfig = {
  total: {
    label: 'Spent',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const MAX_TAGS_SHOWN = 8;
const EXPENSES_PER_PAGE = 10;

export const AccountExpensesCharts = ({ slug }: AccountExpensesChartsProps) => {
  const { from, to } = Route.useSearch();
  const { data: account } = useAccount(slug);
  const {
    expenses: { query },
  } = useAccountExpenses(slug, from, to);
  const currency = account?.currency;

  if (query.isPending) {
    return (
      <div className="space-y-4">
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
      className={cn('space-y-4 transition-opacity', query.isPlaceholderData && 'opacity-60')}
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

// Mirrors the Cashflow view groups: one line per tag that opens into its expenses
const SpendingByTag = ({ charts, currency }: ChartProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const tagged = charts.tags.filter(tag => tag.id !== null);
  const untagged = charts.tags.find(tag => tag.id === null);
  const hiddenTagsCount = Math.max(tagged.length - MAX_TAGS_SHOWN, 0);
  const shownTags = [
    ...(showAllTags ? tagged : tagged.slice(0, MAX_TAGS_SHOWN)),
    ...(untagged ? [untagged] : []),
  ];
  const largestTotal = Math.max(...charts.tags.map(tag => tag.total));

  return (
    <ChartCard title="Spending by tag" description="A transaction with two tags counts in both.">
      <ul className="space-y-1" data-ui="account-spending-by-tag">
        {shownTags.map(tag => (
          <TagGroup
            key={tag.id ?? 'no-tag'}
            tag={tag}
            barWidth={largestTotal > 0 ? (tag.total / largestTotal) * 100 : 0}
            currency={currency}
          />
        ))}
      </ul>
      {hiddenTagsCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 self-start text-xs text-muted-foreground"
          onClick={() => setShowAllTags(current => !current)}
        >
          {showAllTags
            ? 'Show fewer tags'
            : `Show ${hiddenTagsCount} more ${hiddenTagsCount === 1 ? 'tag' : 'tags'}`}
        </Button>
      )}
    </ChartCard>
  );
};

const TagGroup = ({
  tag,
  barWidth,
  currency,
}: {
  tag: I_ExpensesByTag;
  // Bar length relative to the largest tag (0–100)
  barWidth: number;
  currency?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `account-spending-tag-${tag.id ?? 'no-tag'}`;
  const isUntagged = tag.id === null;

  return (
    <li className="rounded-lg">
      <button
        type="button"
        onClick={() => setIsExpanded(current => !current)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="block w-full space-y-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-1.5">
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
            <TagBadge tag={tag} />
            <span
              className={cn(
                'truncate font-semibold',
                isUntagged ? 'italic text-muted-foreground' : 'text-primary'
              )}
            >
              {tag.name}
            </span>
          </span>
          <span className="financial-value shrink-0 font-semibold text-destructive">
            {formatCurrencyAmount(tag.total, { currency })}
          </span>
        </div>
        <div className="flex items-center gap-3 pl-5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isUntagged ? 'bg-muted-foreground/40' : 'bg-destructive/60'
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
            {tag.count} {tag.count === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id={panelId} className="pb-2 pl-7 pr-2">
          <TagExpenses expenses={tag.expenses} currency={currency} />
        </div>
      )}
    </li>
  );
};

// Every expense is already loaded for the charts, so paging happens here
const TagExpenses = ({
  expenses,
  currency,
}: {
  expenses: I_TransactionResponse[];
  currency?: string;
}) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(Math.ceil(expenses.length / EXPENSES_PER_PAGE), 1);
  // A new range can leave fewer pages than the one that was open
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
  const shownExpenses = expenses.slice(firstIndex, firstIndex + EXPENSES_PER_PAGE);

  return (
    <div className="space-y-2">
      <ul className="divide-y rounded-lg border">
        {shownExpenses.map(expense => (
          <CompactExpense key={expense.id} expense={expense} currency={currency} />
        ))}
      </ul>

      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span className="mr-1">
            {firstIndex + 1}–{Math.min(firstIndex + EXPENSES_PER_PAGE, expenses.length)} of{' '}
            {expenses.length}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous expenses"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="Next expenses"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const CompactExpense = ({
  expense,
  currency,
}: {
  expense: I_TransactionResponse;
  currency?: string;
}) => {
  const sourceName = expense.credit_card_name ?? expense.account_name;
  const SourceIcon = expense.credit_card_name ? CreditCard : Landmark;

  return (
    <li className="flex items-center gap-3 px-3 py-2 text-sm">
      <span className="w-12 shrink-0 text-xs text-muted-foreground">
        {format(parseISO(expense.date), 'dd MMM')}
      </span>
      <span className="min-w-0 flex-1 truncate">{expense.description}</span>
      {sourceName && (
        <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
          <SourceIcon className="h-3 w-3" />
          {sourceName}
        </span>
      )}
      <span className="financial-value shrink-0 font-medium">
        {formatCurrencyAmount(expense.amount, { currency })}
      </span>
    </li>
  );
};

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
