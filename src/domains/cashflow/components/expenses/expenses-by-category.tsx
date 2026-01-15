import { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Sector,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { I_GroupedCategory } from '../../utils/grouping-utils';

interface ExpensesByCategoryProps {
  groupedData: I_GroupedCategory[];
  overallTotal: number;
}

// Vibrant palette for main categories
const COLORS = [
  '#0ea5e9', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#6366f1', // Indigo
  '#64748b', // Slate
];

// Helper to lighten/darken colors for subcategories
const adjustColor = (color: string, amount: number) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#333" className="text-xl font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#666" className="text-sm">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </text>
      <text x={cx} y={cy} dy={35} textAnchor="middle" fill="#999" className="text-xs">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export const ExpensesByCategory = ({ groupedData }: ExpensesByCategoryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Prepare data for the chart
  const data = groupedData.map((category, index) => ({
    name: category.name,
    value: category.total,
    color: COLORS[index % COLORS.length],
    subcategories: category.sortedSubcategories?.map((sub, subIndex) => ({
      name: sub.name,
      value: sub.total,
      // Slightly vary the color for subcategories
      color: adjustColor(COLORS[index % COLORS.length], subIndex * -20)
    })) || []
  }));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="p-6 border rounded-3xl bg-neutral-white space-y-6 h-fit shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Category Distribution</h3>
          <p className="text-sm text-muted-foreground">
            Breakdown of expenses by category
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 rounded-md ${chartType === 'pie' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            onClick={() => setChartType('pie')}
          >
            <PieIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 rounded-md ${chartType === 'bar' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={32}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2 rounded-lg shadow-sm">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-sm font-bold" style={{ color: data.color }}>
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                onMouseEnter={onPieEnter}
                background={{ fill: '#f1f5f9', radius: [0, 4, 4, 0] }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={activeIndex === index ? 1 : 0.7}
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Selected Category Details List */}
      {data[activeIndex] && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <h4 className="text-sm font-semibold border-b pb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data[activeIndex].color }} />
            {data[activeIndex].name} Breakdown
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {data[activeIndex].subcategories.length > 0 ? (
              data[activeIndex].subcategories.map((sub: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <span className="text-muted-foreground">{sub.name}</span>
                  <span className="font-medium">
                    {formatCurrency(sub.value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground p-2">No subcategories</p>
            )}
          </div>
        </div>
      )}

      {groupedData.length === 0 && (
        <p className="text-sm text-center py-4 text-muted-foreground italic">
          No expenses to analyze
        </p>
      )}
    </div>
  );
};
