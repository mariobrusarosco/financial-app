import type { I_BalancePoint } from '@/domains/accounts/types/types-and-interfaces';
import { AreaChart, Card, Title, Text } from '@tremor/react';
import { useMemo } from 'react';
import { useAccountBalancePoints } from '@/domains/accounts/hooks/use-account-balance-points';

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

export const AccountBalancePoints = ({ title = 'Balance History', slug }: Props) => {
  const { data: balancePoints, isLoading: isLoadingBalancePoints } = useAccountBalancePoints(slug);

  const chartData = useMemo(
    () => mapBalancePointsToChartData(balancePoints ?? []),
    [balancePoints]
  );

  // Handle empty data
  if (!balancePoints || balancePoints.length === 0) {
    return (
      <>
        <Title>{title}</Title>
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <Text className="text-muted-foreground">No balance history available</Text>
            <Text className="text-sm text-muted-foreground mt-1">
              Balance points will appear here as they are recorded
            </Text>
          </div>
        </div>
      </>
    );
  }

  if (isLoadingBalancePoints) {
    return <div className="flex items-center justify-center h-64 text-center">Loading...</div>;
  }

  // Calculate trend information
  const latestBalance = chartData[chartData.length - 1]?.balance || 0;
  const previousBalance = chartData[chartData.length - 2]?.balance || latestBalance;
  const trend = latestBalance - previousBalance;
  const trendPercentage = previousBalance !== 0 ? (trend / previousBalance) * 100 : 0;

  return (
    <>
      <div className="mb-6 min-w-80">
        <Title className="text-lg font-semibold">{title}</Title>
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
    </>
  );
};
