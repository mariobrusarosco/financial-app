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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SubscriptionsChartProps {
  data?: { month: string; amount: number }[];
  isLoading?: boolean;
}

export const SubscriptionsChart = ({ data, isLoading }: SubscriptionsChartProps) => {
  const formatCurrency = (number: number) => {
    return `$${Intl.NumberFormat('us', { maximumFractionDigits: 0 }).format(number)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm text-primary font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div data-ui="subscriptions-chart-section" className="bg-section-background rounded-3xl p-6">
      <Card className="shadow-none border-none bg-neutral-white h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-semibold">Subscription Cost Forecast</CardTitle>
          <CardDescription>
            Projected subscription expenses for the next 12 months.
          </CardDescription>
        </CardHeader>

        <CardContent className="h-[300px] w-full pt-4">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  cursor={{ fill: 'oklch(var(--muted) / 0.3)' }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="amount"
                  fill="oklch(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};