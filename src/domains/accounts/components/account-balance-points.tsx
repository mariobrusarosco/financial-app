import type { I_BalancePoint } from '@/domains/accounts/types/types-and-interfaces';
import { AreaChart, Title, Text } from '@tremor/react';
import { useMemo, useState } from 'react';
import { useAccountBalancePoints } from '@/domains/accounts/hooks/use-account-balance-points';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
import type { DateRange } from 'react-day-picker';

interface Props {
  title?: string;
  slug: string;
}

const formatCurrency = (value: number): string => {
  // Handle Brazilian Real (R$) formatting based on your data
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

const EmptyBalancePoints = ({
  title,
  dateRange,
  setDateRange,
}: {
  title: string;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}) => {
  return (
    <div data-ui="empty-balance-points">
      <div className="flex items-center justify-between mb-4">
        <Title>{title}</Title>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <Text className="text-muted-foreground">No balance history available</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            Balance points will appear here as they are recorded
          </Text>
        </div>
      </div>
    </div>
  );
};

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  };
};

const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AccountBalancePoints = ({ title = 'Balance History', slug }: Props) => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());

  const apiDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      const defaultRange = getDefaultDateRange();
      return {
        startDate: formatDateForAPI(defaultRange.from!),
        endDate: formatDateForAPI(defaultRange.to!),
      };
    }

    return {
      startDate: formatDateForAPI(dateRange.from),
      endDate: formatDateForAPI(dateRange.to),
    };
  }, [dateRange]);

  const { data: balancePoints, isLoading: isLoadingBalancePoints } = useAccountBalancePoints(
    slug,
    apiDateRange.startDate,
    apiDateRange.endDate
  );

  const chartData = useMemo(
    () => mapBalancePointsToChartData(balancePoints ?? []),
    [balancePoints]
  );

  // Handle empty data
  if (!balancePoints || balancePoints.length === 0) {
    return <EmptyBalancePoints title={title} dateRange={dateRange} setDateRange={setDateRange} />;
  }

  if (isLoadingBalancePoints) {
    return <div className="flex items-center justify-center h-64 text-center">Loading...</div>;
  }

  return (
    <div data-ui="account-balance-points">
      <div className="mb-6 min-w-80">
        <div className="flex items-center justify-between mb-4">
          <Title className="text-lg font-semibold">{title}</Title>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <div className="min-h-[400px] w-full">
          <AreaChart
            className="h-96 w-full"
            data={chartData}
            index="date"
            categories={['balance']}
            colors={['blue']}
            valueFormatter={formatCurrency}
            showLegend={false}
            showGridLines={true}
            curveType="monotone"
            showXAxis={true}
            showYAxis={false}
            autoMinValue={false}
            enableLegendSlider={false}
            // yAxisWidth={100}
            allowDecimals={true}
            connectNulls={true}
            showTooltip={true}
            customTooltip={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      {`Balance: ${formatCurrency(payload[0].value as number)}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      </div>
    </div>
  );
};
