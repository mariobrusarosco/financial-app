# How to Create Financial Charts with Tremor React

## Quick Start Guide

This guide shows you how to create financial charts using Tremor React components step-by-step.

## Prerequisites

- Tremor React installed: `@tremor/react`
- Basic understanding of React and TypeScript

## Step-by-Step Chart Creation

### Step 1: Import Required Components

```tsx
import {
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  Card,
  Title,
  Text,
  Metric,
} from '@tremor/react';
```

### Step 2: Prepare Your Data

Structure your data according to Tremor's requirements:

```tsx
// For time-series data (balance trends, performance)
interface TimeSeriesData {
  date: string;           // X-axis value
  [key: string]: number | string;  // Y-axis values
}

// For categorical data (spending breakdown)
interface CategoryData {
  category: string;       // Category name
  amount: number;         // Value
  percentage?: number;    // Optional percentage
}

// Example data
const balanceData: TimeSeriesData[] = [
  { date: 'Jan 2024', checking: 5420, savings: 12300, investment: 45600 },
  { date: 'Feb 2024', checking: 4890, savings: 13100, investment: 47200 },
  { date: 'Mar 2024', checking: 5680, savings: 13800, investment: 46800 },
];

const spendingData: CategoryData[] = [
  { category: 'Food & Dining', amount: 1250, percentage: 28.5 },
  { category: 'Transportation', amount: 850, percentage: 19.3 },
  { category: 'Shopping', amount: 720, percentage: 16.4 },
];
```

### Step 3: Create Currency Formatter

Always format financial values consistently:

```tsx
const formatCurrency = (value: number): string => 
  `$${Intl.NumberFormat('us').format(value).toString()}`;

const formatPercentage = (value: number): string => 
  `${value.toFixed(1)}%`;
```

### Step 4: Choose the Right Chart Type

| Chart Type | Best For | Example Use Cases |
|------------|----------|-------------------|
| **AreaChart** | Trends over time | Account balances, portfolio growth |
| **LineChart** | Simple trend lines | Price movements, KPI tracking |
| **BarChart** | Comparisons | Monthly spending, account comparison |
| **DonutChart** | Proportions | Spending categories, asset allocation |

### Step 5: Create Your Chart Component

#### Balance Trend Chart (AreaChart)

```tsx
function BalanceTrendChart() {
  return (
    <Card className="max-w-4xl">
      <Title>Account Balance Trends</Title>
      <Text>6-month overview of all accounts</Text>
      <AreaChart
        className="h-80 mt-6"
        data={balanceData}
        index="date"                    // X-axis field
        categories={['checking', 'savings', 'investment']}  // Y-axis fields
        colors={['blue', 'emerald', 'violet']}              // Line colors
        valueFormatter={formatCurrency}                     // Format Y-axis values
        showLegend={true}                                   // Show legend
        showGridLines={true}                                // Show grid
        curveType="monotone"                               // Smooth curves
      />
    </Card>
  );
}
```

#### Spending Breakdown (DonutChart)

```tsx
function SpendingBreakdownChart() {
  return (
    <Card className="max-w-lg">
      <Title>Monthly Spending Breakdown</Title>
      <Text>Distribution by category</Text>
      <DonutChart
        className="h-60 mt-6"
        data={spendingData}
        category="amount"           // Value field
        index="category"            // Label field
        valueFormatter={formatCurrency}
        colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
        showLabel={true}            // Show category labels
        showAnimation={true}        // Enable animations
      />
    </Card>
  );
}
```

#### Monthly Comparison (BarChart)

```tsx
function MonthlyComparisonChart() {
  const monthlyData = [
    { month: 'Jan', income: 8500, expenses: 6200, savings: 2300 },
    { month: 'Feb', income: 8500, expenses: 5800, savings: 2700 },
    { month: 'Mar', income: 9200, expenses: 6100, savings: 3100 },
  ];

  return (
    <Card className="max-w-4xl">
      <Title>Monthly Cash Flow</Title>
      <Text>Income, expenses, and savings comparison</Text>
      <BarChart
        className="h-80 mt-6"
        data={monthlyData}
        index="month"
        categories={['income', 'expenses', 'savings']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={formatCurrency}
        showLegend={true}
        stack={false}               // Side-by-side bars (not stacked)
      />
    </Card>
  );
}
```

#### Performance Line Chart

```tsx
function PerformanceLineChart() {
  const performanceData = [
    { date: 'Jan', portfolio: 45600, benchmark: 45000 },
    { date: 'Feb', portfolio: 47200, benchmark: 46500 },
    { date: 'Mar', portfolio: 46800, benchmark: 47000 },
  ];

  return (
    <Card className="max-w-4xl">
      <Title>Investment Performance</Title>
      <Text>Portfolio vs benchmark comparison</Text>
      <LineChart
        className="h-80 mt-6"
        data={performanceData}
        index="date"
        categories={['portfolio', 'benchmark']}
        colors={['violet', 'gray']}
        valueFormatter={formatCurrency}
        showLegend={true}
        curveType="monotone"        // Smooth line curves
      />
    </Card>
  );
}
```

## Advanced Patterns

### Dynamic Data Integration

```tsx
import { useAccounts } from '@domains/accounts/hooks/use-accounts';

function LiveBalanceChart() {
  const { data: accounts, isLoading, error } = useAccounts();
  
  // Transform API data for chart consumption
  const chartData = useMemo(() => {
    if (!accounts) return [];
    
    return accounts.map(account => ({
      name: account.name,
      balance: account.balance,
      type: account.type,
    }));
  }, [accounts]);

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse h-80 bg-gray-200 rounded" />
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <Text className="text-red-600">Failed to load chart data</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Title>Current Account Balances</Title>
      <BarChart
        className="h-80 mt-6"
        data={chartData}
        index="name"
        categories={['balance']}
        colors={['blue']}
        valueFormatter={formatCurrency}
      />
    </Card>
  );
}
```

### Interactive Charts

```tsx
function InteractiveSpendingChart() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState(null);

  return (
    <Card>
      <Title>Interactive Spending Analysis</Title>
      {selectedCategory && (
        <Text className="mt-2 text-blue-600">
          Selected: {selectedCategory} - {formatCurrency(selectedData?.amount || 0)}
        </Text>
      )}
      <DonutChart
        className="h-60 mt-6"
        data={spendingData}
        category="amount"
        index="category"
        valueFormatter={formatCurrency}
        onValueChange={(value) => {
          setSelectedCategory(value?.category || null);
          setSelectedData(value || null);
        }}
      />
    </Card>
  );
}
```

### Progress Tracking Charts

```tsx
import { ProgressBar, CategoryBar, Flex } from '@tremor/react';

function BudgetProgressChart() {
  const budgetCategories = [
    { name: 'Food', spent: 1250, budget: 1500 },
    { name: 'Transport', spent: 850, budget: 1000 },
    { name: 'Entertainment', spent: 420, budget: 600 },
  ];

  return (
    <Card>
      <Title>Budget Progress</Title>
      <Text>Monthly spending vs budget</Text>
      
      <div className="mt-6 space-y-4">
        {budgetCategories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div key={category.name}>
              <Flex>
                <Text className="truncate">{category.name}</Text>
                <Text>
                  {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                </Text>
              </Flex>
              <CategoryBar
                values={[Math.min(percentage, 100), Math.max(0, percentage - 100)]}
                colors={isOverBudget ? ['red', 'red'] : ['blue', 'gray']}
                className="mt-1"
              />
              {isOverBudget && (
                <Text className="text-xs text-red-600 mt-1">
                  {formatPercentage(percentage - 100)} over budget
                </Text>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

### Metric Cards with Charts

```tsx
function AccountMetricCard({ account }) {
  const trendData = account.monthlyBalances.map(item => ({
    month: item.month,
    balance: item.balance,
  }));

  return (
    <Card className="max-w-xs">
      <Flex alignItems="start">
        <div>
          <Text>{account.name}</Text>
          <Metric>{formatCurrency(account.currentBalance)}</Metric>
        </div>
        <Badge 
          size="xs" 
          color={account.changeType === 'increase' ? 'emerald' : 'red'}
        >
          {account.change > 0 ? '+' : ''}{formatPercentage(account.change)}
        </Badge>
      </Flex>
      
      {/* Mini trend chart */}
      <LineChart
        className="h-16 mt-4"
        data={trendData}
        index="month"
        categories={['balance']}
        colors={['blue']}
        showXAxis={false}
        showYAxis={false}
        showLegend={false}
        showGridLines={false}
      />
    </Card>
  );
}
```

## Responsive Design Patterns

### Mobile-First Layout

```tsx
function ResponsiveFinancialDashboard() {
  return (
    <div className="space-y-6">
      {/* Mobile: Stack vertically */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chart takes full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2">
          <BalanceTrendChart />
        </div>
        
        {/* Sidebar chart takes full width on mobile, 1/3 on desktop */}
        <div>
          <SpendingBreakdownChart />
        </div>
      </div>
      
      {/* Metric cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map(account => (
          <AccountMetricCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
```

### Responsive Chart Heights

```tsx
function AdaptiveChart() {
  return (
    <AreaChart
      className="h-64 sm:h-80 lg:h-96"  // Responsive heights
      data={data}
      // ... other props
    />
  );
}
```

## Common Patterns for Financial Apps

### 1. Net Worth Trend

```tsx
function NetWorthChart() {
  const netWorthData = [
    { date: 'Jan', assets: 65000, liabilities: 15000, netWorth: 50000 },
    { date: 'Feb', assets: 67000, liabilities: 14500, netWorth: 52500 },
    { date: 'Mar', assets: 68500, liabilities: 14000, netWorth: 54500 },
  ];

  return (
    <Card>
      <Title>Net Worth Progression</Title>
      <AreaChart
        className="h-80 mt-6"
        data={netWorthData}
        index="date"
        categories={['assets', 'liabilities', 'netWorth']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={formatCurrency}
      />
    </Card>
  );
}
```

### 2. Investment Allocation

```tsx
function InvestmentAllocationChart() {
  const allocationData = [
    { asset: 'Stocks', allocation: 60, amount: 30000 },
    { asset: 'Bonds', allocation: 25, amount: 12500 },
    { asset: 'Real Estate', allocation: 10, amount: 5000 },
    { asset: 'Cash', allocation: 5, amount: 2500 },
  ];

  return (
    <Card>
      <Title>Investment Portfolio Allocation</Title>
      <DonutChart
        className="h-60 mt-6"
        data={allocationData}
        category="amount"
        index="asset"
        valueFormatter={formatCurrency}
        colors={['blue', 'emerald', 'amber', 'gray']}
      />
    </Card>
  );
}
```

### 3. Expense Categories Over Time

```tsx
function ExpenseTrendsChart() {
  const expenseData = [
    { month: 'Jan', food: 800, transport: 300, entertainment: 200 },
    { month: 'Feb', food: 750, transport: 350, entertainment: 180 },
    { month: 'Mar', food: 820, transport: 320, entertainment: 250 },
  ];

  return (
    <Card>
      <Title>Monthly Expense Trends</Title>
      <AreaChart
        className="h-80 mt-6"
        data={expenseData}
        index="month"
        categories={['food', 'transport', 'entertainment']}
        colors={['red', 'orange', 'yellow']}
        valueFormatter={formatCurrency}
        stack={true}  // Stacked area chart
      />
    </Card>
  );
}
```

## Testing Your Charts

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import { BalanceTrendChart } from './balance-trend-chart';

describe('BalanceTrendChart', () => {
  it('renders chart title', () => {
    render(<BalanceTrendChart />);
    expect(screen.getByText('Account Balance Trends')).toBeInTheDocument();
  });

  it('displays formatted currency values', () => {
    render(<BalanceTrendChart />);
    // Test that currency formatting is applied to chart data
    expect(screen.getByText(/\$5,420/)).toBeInTheDocument();
  });
});
```

## Quick Reference

### Chart Selection Guide

| Data Type | Chart Type | Tremor Component |
|-----------|------------|------------------|
| Time series (single metric) | Line | `LineChart` |
| Time series (multiple metrics) | Area | `AreaChart` |
| Categories comparison | Bar | `BarChart` |
| Percentage breakdown | Donut | `DonutChart` |
| Progress tracking | Progress bar | `ProgressBar` |
| Multiple progress items | Category bar | `CategoryBar` |

### Essential Props

```tsx
// Common props for all chart types
interface CommonChartProps {
  className?: string;
  data: any[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGridLines?: boolean;
}

// Time-series charts (Area, Line, Bar)
interface TimeSeriesProps extends CommonChartProps {
  index: string;              // X-axis field name
  categories: string[];       // Y-axis field names
}

// Categorical charts (Donut)
interface CategoricalProps extends CommonChartProps {
  index: string;              // Label field name
  category: string;           // Value field name
}
```

### Color Recommendations

```tsx
// Financial color palette
const colors = {
  income: 'emerald',
  expenses: 'red', 
  savings: 'blue',
  investment: 'violet',
  checking: 'blue',
  credit: 'orange',
  cash: 'gray',
};
```

---

## Next Steps

1. **Practice**: Create charts with your actual financial data
2. **Experiment**: Try different chart types for the same data
3. **Optimize**: Focus on performance for large datasets
4. **Test**: Ensure charts work across devices and screen sizes

For more examples, visit `/tremor-demo` in your application.