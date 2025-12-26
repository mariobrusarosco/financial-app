import type { I_BalancePoint } from '@/domains/accounts/types/types-and-interfaces';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useAccountBalancePoints } from '@/domains/accounts/hooks/use-account-balance-points';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/domains/ui-system/components/chart';
import { Route } from '@/routes/(auth)/route';
import { startOfMonth, endOfMonth, format, parseISO, isValid } from 'date-fns';
import { UseQueryResult } from '@tanstack/react-query';
import { I_AccountTransactionsResponse } from '@/domains/transactions/types/types-and-interfaces';

interface Props {
  title?: string;
  slug: string;
  transactionsQuery: UseQueryResult<I_AccountTransactionsResponse, Error>;
}

// Chart configuration for shadcn/ui charts
const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const formatCurrency = (value: number): string => {
  return `R$${Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
};

const mapBalancePointsToChartData = (balancePoints: I_BalancePoint[]) => {
  return balancePoints
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(balancePoint => ({
      date: formatDate(balancePoint.date),
      balance: balancePoint.balance,
      rawDate: balancePoint.date,
      snapshotType: balancePoint.snapshot_type,
    }));
};

const EmptyBalancePoints = ({ title }: { title: string }) => {
  return (
    <div data-ui="empty-balance-points">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <p className="text-muted-foreground">No balance history available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Balance points will appear here as they are recorded
          </p>
        </div>
      </div>
    </div>
  );
};

const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const AccountBalancePoints = ({ title = 'Balance History', slug }: Props) => {
  const { from, to } = Route.useSearch();

  const apiDateRange = useMemo(() => {
    const today = new Date();
    const defaultFrom = startOfMonth(today);
    const defaultTo = endOfMonth(today);

    const fromDate = from ? parseISO(from) : defaultFrom;
    const toDate = to ? parseISO(to) : defaultTo;

    return {
      startDate: formatDateForAPI(isValid(fromDate) ? fromDate : defaultFrom),
      endDate: formatDateForAPI(isValid(toDate) ? toDate : defaultTo),
    };
  }, [from, to]);

  const { data: balancePoints, isLoading: isLoadingBalancePoints } = useAccountBalancePoints(
    slug,
    apiDateRange.startDate,
    apiDateRange.endDate
  );

  const chartData = useMemo(
    () => mapBalancePointsToChartData(balancePoints ?? []),
    [balancePoints]
  );

  if (isLoadingBalancePoints) {
    return <div className="flex items-center justify-center h-64 text-center">Loading...</div>;
  }

  // Handle empty data
  if (!balancePoints || balancePoints.length === 0) {
    return <EmptyBalancePoints title={title} />;
  }

  return (
    <div data-ui="account-balance-points">
      <div className="mb-6 min-w-80">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => formatCurrency(value)}
              width={80}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="font-mono font-semibold text-foreground">
                        {formatCurrency(value as number)}
                      </span>
                    </div>
                  )}
                  labelFormatter={label => (
                    <div className="font-medium text-foreground mb-1">{label}</div>
                  )}
                />
              }
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#balanceGradient)"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'var(--color-balance)',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
