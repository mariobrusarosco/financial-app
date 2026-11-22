import type { I_BalancePoint } from '@/domains/accounts/types/types-and-interfaces';
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';
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
import {
  formatCompactCurrency,
  formatCurrencyAmount,
  formatDateMedium,
} from '@/domains/global/utils/formatting';

interface Props {
  title?: string;
  slug: string;
}

// Chart configuration for shadcn/ui charts
const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const mapBalancePointsToChartData = (balancePoints: I_BalancePoint[]) => {
  return balancePoints
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((balancePoint, index, sortedPoints) => {
      // The API sends balances as text ("7117.90"); recharts needs numbers to build the scale
      const balance = Number(balancePoint.balance);
      const previousBalance = index > 0 ? Number(sortedPoints[index - 1].balance) : null;

      return {
        date: formatDateMedium(balancePoint.date),
        day: format(parseISO(balancePoint.date), 'MMM d'),
        balance,
        change: previousBalance === null ? null : balance - previousBalance,
        rawDate: balancePoint.date,
        snapshotType: balancePoint.snapshot_type,
      };
    });
};

type T_BalanceChartPoint = ReturnType<typeof mapBalancePointsToChartData>[number];

const EmptyBalancePoints = ({ title }: { title: string }) => {
  return (
    <div data-ui="empty-balance-points">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="flex h-48 items-center justify-center text-center">
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

const formatChange = (change: number) => {
  const formatted = formatCurrencyAmount(change, { locale: 'pt-BR', currency: 'BRL' });
  return change > 0 ? `+${formatted}` : formatted;
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
  const hasNegativeBalance = chartData.some(point => point.balance < 0);

  if (isLoadingBalancePoints) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading balance history…
      </div>
    );
  }

  if (!balancePoints || balancePoints.length === 0) {
    return <EmptyBalancePoints title={title} />;
  }

  return (
    <div data-ui="account-balance-points" className="h-48 min-w-0 overflow-hidden">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
            right: 12,
            top: 12,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis
            width={64}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            padding={{ top: 12, bottom: 12 }}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          {hasNegativeBalance && (
            <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.4} />
          )}
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const { change } = item.payload as T_BalanceChartPoint;

                  return (
                    <div className="grid w-full gap-1">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-muted-foreground">Balance</span>
                        <span className="font-mono font-semibold text-primary">
                          {formatCurrencyAmount(value as number, {
                            locale: 'pt-BR',
                            currency: 'BRL',
                          })}
                        </span>
                      </div>
                      {change !== null && (
                        <div className="flex items-center justify-between gap-8">
                          <span className="text-muted-foreground">Change</span>
                          <span className="font-mono">{formatChange(change)}</span>
                        </div>
                      )}
                    </div>
                  );
                }}
                labelFormatter={(_label, payload) => (
                  <div className="font-medium text-primary mb-1">
                    {(payload[0]?.payload as T_BalanceChartPoint | undefined)?.date}
                  </div>
                )}
              />
            }
          />
          <Line
            dataKey="balance"
            type="stepAfter"
            stroke="var(--color-balance)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: 'var(--color-balance)',
              stroke: 'var(--background)',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
