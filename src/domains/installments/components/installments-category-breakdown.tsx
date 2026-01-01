import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';
import type { I_CategoryTreeNode } from '@/domains/categories/types';
import { aggregateInstallmentsByCategory } from '../utils/installment-calculators';
import { generateDistinctColors } from '@/domains/ui-system/utils/color-generator';

interface InstallmentsCategoryBreakdownProps {
  plans: I_InstallmentPlan[];
  categories: I_CategoryTreeNode[];
}

export const InstallmentsCategoryBreakdown = ({ plans, categories }: InstallmentsCategoryBreakdownProps) => {
  const chartData = aggregateInstallmentsByCategory(plans, categories);
  const colors = generateDistinctColors(chartData.length);

  const formatCurrency = (number: number) => {
    return `${Intl.NumberFormat('us').format(number)}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      data-ui="installments-category-breakdown-section"
      className="bg-section-background rounded-3xl p-6"
    >
      <Card className="shadow-none border-none bg-neutral-white h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-semibold">Spending by Category</CardTitle>
          <CardDescription>
            Distribution of outstanding debt by spending category.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-xs text-muted-foreground font-medium block">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm group hover:bg-muted/50 p-1.5 rounded-md transition-colors">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="truncate font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-primary ml-2">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};