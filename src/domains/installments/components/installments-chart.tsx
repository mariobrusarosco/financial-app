import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';
import { groupFutureInstallmentsByMonth } from '../utils/installment-calculators';

interface InstallmentsChartProps {
  plans: I_InstallmentPlan[];
}

export const InstallmentsChart = ({ plans }: InstallmentsChartProps) => {
  const chartData = groupFutureInstallmentsByMonth(plans);

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
    <div data-ui="installments-chart-section" className="bg-section-background rounded-3xl p-6">
      <Card className="shadow-none border-none bg-neutral-white h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-semibold">Debt Burndown Forecast</CardTitle>
          <CardDescription>Projected installment payments for the next 12 months.</CardDescription>
        </CardHeader>

        <CardContent className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="teal" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'teal', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: 'teal', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip cursor={{ fill: 'rgb(0,0,0,0.03)' }} content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="teal" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
