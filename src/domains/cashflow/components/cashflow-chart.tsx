import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { I_MonthlyCashflow } from '../types';

interface CashflowChartProps {
  data: I_MonthlyCashflow[];
}

export const CashflowChart = ({ data }: CashflowChartProps) => {
  const formatCurrency = (number: number) => {
    return `$${Intl.NumberFormat('us', { maximumFractionDigits: 0 }).format(number)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground capitalize">{entry.name}:</span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-medium">Net:</span>
            <span className={`text-sm font-black ${payload[0].value - payload[1].value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(payload[0].value - payload[1].value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-none border border-border bg-neutral-white h-full flex flex-col rounded-3xl">
      <CardHeader>
        <CardTitle className="text-primary font-semibold">Income vs Expenses</CardTitle>
        <CardDescription>Monthly comparison of your cash inflows and outflows.</CardDescription>
      </CardHeader>

      <CardContent className="h-[400px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip cursor={{ fill: 'rgb(0,0,0,0.03)' }} content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
            <Bar 
              name="income" 
              dataKey="income" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
            <Bar 
              name="expenses" 
              dataKey="expenses" 
              fill="#F43F5E" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
