# Tremor React Integration Guide

## Overview

Tremor React is our chosen chart library for building beautiful, accessible financial dashboards. This guide covers installation, usage patterns, and best practices for integrating Tremor charts into our financial application.

## Why Tremor React?

### Key Benefits for Financial Applications

- **Financial-First Design**: Built-in currency formatting and financial color schemes
- **Beautiful Defaults**: Professional charts with minimal configuration
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **TypeScript Native**: Comprehensive type safety out of the box
- **Tailwind Integration**: Seamless integration with our existing design system
- **Performance**: Optimized for large datasets common in financial apps
- **Responsive**: Mobile-first design that adapts to all screen sizes

### Chart Types Available

| Chart Type | Use Cases | Best For |
|------------|-----------|----------|
| **AreaChart** | Balance trends, portfolio growth | Time-series financial data |
| **LineChart** | Price movements, KPI tracking | Trend analysis |
| **BarChart** | Monthly comparisons, category breakdown | Comparative analysis |
| **DonutChart** | Spending categories, asset allocation | Percentage distributions |
| **CategoryBar** | Budget progress, goal tracking | Progress indicators |
| **ProgressBar** | Savings goals, debt payoff | Single metric progress |

## Installation & Setup

### 1. Install Tremor React

```bash
yarn add @tremor/react
```

### 2. Import Components

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

### 3. Verify Installation

Visit `/tremor-demo` to see working examples of all chart types.

## Core Components & Patterns

### Basic Chart Structure

Every Tremor chart follows this pattern:

```tsx
import { AreaChart, Card, Title, Text } from '@tremor/react';

function BalanceChart() {
  const data = [
    { date: 'Jan 2024', checking: 5420, savings: 12300 },
    { date: 'Feb 2024', checking: 4890, savings: 13100 },
    // ... more data
  ];

  return (
    <Card className="max-w-4xl">
      <Title>Account Balances</Title>
      <Text>Monthly balance trends</Text>
      <AreaChart
        className="h-80 mt-6"
        data={data}
        index="date"
        categories={['checking', 'savings']}
        colors={['blue', 'emerald']}
        valueFormatter={(value) => formatCurrency(value)}
      />
    </Card>
  );
}
```

### Currency Formatting

Always use consistent currency formatting:

```tsx
const formatCurrency = (value: number): string => 
  `$${Intl.NumberFormat('us').format(value).toString()}`;

// Usage in charts
<AreaChart
  valueFormatter={formatCurrency}
  // ... other props
/>
```

### Color Scheme

Use our financial color palette:

```tsx
const financialColors = {
  income: 'emerald',
  expenses: 'red',
  savings: 'blue',
  investment: 'violet',
  checking: 'blue',
  creditCard: 'orange',
  neutral: 'gray',
};

// Usage
<BarChart
  colors={['emerald', 'red', 'blue']}
  categories={['income', 'expenses', 'savings']}
/>
```

## Financial Chart Examples

### 1. Account Balance Trends

```tsx
interface BalanceData {
  date: string;
  checking: number;
  savings: number;
  investment: number;
}

function AccountBalanceChart({ data }: { data: BalanceData[] }) {
  return (
    <Card>
      <Title>Account Balance Trends</Title>
      <Text>6-month overview of account balances</Text>
      <AreaChart
        className="h-80 mt-6"
        data={data}
        index="date"
        categories={['checking', 'savings', 'investment']}
        colors={['blue', 'emerald', 'violet']}
        valueFormatter={formatCurrency}
        showLegend={true}
        curveType="monotone"
      />
    </Card>
  );
}
```

### 2. Spending Breakdown

```tsx
interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
}

function SpendingBreakdown({ data }: { data: SpendingData[] }) {
  return (
    <Card className="max-w-lg">
      <Title>Monthly Spending</Title>
      <Text>Breakdown by category</Text>
      <DonutChart
        className="h-60 mt-6"
        data={data}
        category="amount"
        index="category"
        valueFormatter={formatCurrency}
        colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
        showLabel={true}
      />
    </Card>
  );
}
```

### 3. Cash Flow Analysis

```tsx
interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
}

function CashFlowChart({ data }: { data: CashFlowData[] }) {
  return (
    <Card>
      <Title>Monthly Cash Flow</Title>
      <Text>Income vs expenses analysis</Text>
      <BarChart
        className="h-80 mt-6"
        data={data}
        index="month"
        categories={['income', 'expenses', 'netFlow']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={formatCurrency}
        showLegend={true}
      />
    </Card>
  );
}
```

### 4. Investment Performance

```tsx
function InvestmentPerformance() {
  return (
    <Card>
      <Title>Portfolio Performance</Title>
      <Text>12-month investment returns</Text>
      <LineChart
        className="h-80 mt-6"
        data={portfolioData}
        index="date"
        categories={['portfolioValue', 'benchmark']}
        colors={['violet', 'gray']}
        valueFormatter={formatCurrency}
        showLegend={true}
        curveType="monotone"
      />
    </Card>
  );
}
```

### 5. Budget Progress Tracking

```tsx
function BudgetTracker() {
  const categories = [
    { name: 'Food', spent: 1250, budget: 1500 },
    { name: 'Transport', spent: 850, budget: 1000 },
    { name: 'Entertainment', spent: 420, budget: 600 },
  ];

  return (
    <Card>
      <Title>Budget Progress</Title>
      <div className="mt-6 space-y-4">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div key={category.name}>
              <Flex>
                <Text>{category.name}</Text>
                <Text>
                  {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                </Text>
              </Flex>
              <CategoryBar
                values={[Math.min(percentage, 100)]}
                colors={[isOverBudget ? 'red' : 'blue']}
                className="mt-1"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

## Advanced Patterns

### Dynamic Data Integration

```tsx
import { useAccounts } from '@domains/accounts/hooks/use-accounts';

function LiveBalanceChart() {
  const { data: accounts, isLoading } = useAccounts();
  
  const chartData = useMemo(() => {
    if (!accounts) return [];
    
    return accounts.map(account => ({
      name: account.name,
      balance: account.balance,
      type: account.type,
    }));
  }, [accounts]);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse h-80 bg-gray-200 rounded" />
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

  return (
    <Card>
      <Title>Spending Analysis</Title>
      {selectedCategory && (
        <Text className="mt-2">
          Selected: {selectedCategory}
        </Text>
      )}
      <DonutChart
        className="h-60 mt-6"
        data={spendingData}
        category="amount"
        index="category"
        valueFormatter={formatCurrency}
        onValueChange={(value) => setSelectedCategory(value?.category || null)}
      />
    </Card>
  );
}
```

### Responsive Chart Layouts

```tsx
function ResponsiveDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Mobile: 1 column, Desktop: 2 columns, Large: 3 columns */}
      <div className="lg:col-span-2">
        <BalanceChart />
      </div>
      <div>
        <SpendingBreakdown />
      </div>
      <div className="lg:col-span-1">
        <BudgetProgress />
      </div>
      <div className="lg:col-span-2">
        <CashFlowChart />
      </div>
    </div>
  );
}
```

## Styling & Theming

### Custom Colors

```tsx
// Define custom color palette
const customColors = {
  brand: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

// Use in charts
<AreaChart
  colors={[customColors.brand, customColors.success]}
  // ... other props
/>
```

### Dark Mode Support

Tremor automatically adapts to your dark mode theme:

```tsx
// No additional configuration needed
// Charts automatically use dark mode colors when theme is dark
function DarkModeChart() {
  return (
    <Card>
      <AreaChart
        // Chart automatically adapts to dark/light mode
        data={data}
        colors={['blue', 'emerald']}
      />
    </Card>
  );
}
```

### Custom Card Styling

```tsx
function StyledChart() {
  return (
    <Card className="border-l-4 border-l-blue-500 shadow-lg">
      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-t">
        <Title className="text-blue-900 dark:text-blue-100">
          Investment Performance
        </Title>
      </div>
      <AreaChart
        className="h-80 mt-4"
        // ... chart props
      />
    </Card>
  );
}
```

## Performance Optimization

### Data Processing

```tsx
// Memoize expensive data transformations
const chartData = useMemo(() => {
  return rawTransactions
    .filter(tx => tx.date >= startDate)
    .reduce((acc, tx) => {
      const month = format(tx.date, 'MMM yyyy');
      acc[month] = (acc[month] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);
}, [rawTransactions, startDate]);

// Use React.memo for expensive chart components
const ExpensiveChart = React.memo(function ExpensiveChart({ data }) {
  return (
    <AreaChart data={data} /* ... props */ />
  );
});
```

### Large Dataset Handling

```tsx
function LargeDatasetChart() {
  // Sample large datasets for better performance
  const sampledData = useMemo(() => {
    if (largeDataset.length > 1000) {
      // Sample every nth point for visualization
      const sampleRate = Math.ceil(largeDataset.length / 500);
      return largeDataset.filter((_, index) => index % sampleRate === 0);
    }
    return largeDataset;
  }, [largeDataset]);

  return (
    <AreaChart
      data={sampledData}
      // ... other props
    />
  );
}
```

## Testing Strategies

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { BalanceChart } from './balance-chart';

describe('BalanceChart', () => {
  const mockData = [
    { date: 'Jan 2024', checking: 5000, savings: 10000 },
    { date: 'Feb 2024', checking: 5500, savings: 10500 },
  ];

  it('renders chart with correct title', () => {
    render(<BalanceChart data={mockData} />);
    expect(screen.getByText('Account Balance Trends')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<BalanceChart data={mockData} />);
    // Test that currency formatting is applied
    expect(screen.getByText(/\$5,000/)).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
// Test charts with real data
import { useAccounts } from '@domains/accounts/hooks/use-accounts';

jest.mock('@domains/accounts/hooks/use-accounts');

it('displays real account data in chart', async () => {
  (useAccounts as jest.Mock).mockReturnValue({
    data: mockAccounts,
    isLoading: false,
  });

  render(<LiveBalanceChart />);
  
  await waitFor(() => {
    expect(screen.getByText('Main Checking')).toBeInTheDocument();
  });
});
```

## Error Handling

### Loading States

```tsx
function ChartWithLoading({ isLoading, data }) {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-80 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <AreaChart data={data} /* ... props */ />
    </Card>
  );
}
```

### Error States

```tsx
function ChartWithErrorHandling({ data, error }) {
  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <Text className="text-red-600">
            Failed to load chart data
          </Text>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Text className="text-gray-600">
            No data available for this period
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <AreaChart data={data} /* ... props */ />
    </Card>
  );
}
```

## Best Practices

### 1. Data Structure Consistency

```tsx
// Always use consistent data structures
interface ChartDataPoint {
  date: string;          // Use ISO date strings
  value: number;         // Always numeric values
  category?: string;     // Optional categorical data
  metadata?: object;     // Additional context
}
```

### 2. Color Accessibility

```tsx
// Use color-blind friendly palettes
const accessibleColors = [
  'blue',      // Safe for all color vision types
  'orange',    // High contrast with blue
  'emerald',   // Good contrast
  'violet',    // Distinct from above
];
```

### 3. Responsive Design

```tsx
// Always consider mobile users
function ResponsiveChart() {
  return (
    <Card>
      <AreaChart
        className="h-60 sm:h-80 lg:h-96"  // Responsive heights
        // ... other props
      />
    </Card>
  );
}
```

### 4. Performance Monitoring

```tsx
// Monitor chart rendering performance
import { Profiler } from 'react';

function ProfiledChart() {
  const onRender = (id, phase, actualDuration) => {
    if (actualDuration > 100) {
      console.warn(`Chart ${id} took ${actualDuration}ms to render`);
    }
  };

  return (
    <Profiler id="FinancialChart" onRender={onRender}>
      <AreaChart data={largeDataset} />
    </Profiler>
  );
}
```

## Migration from Other Chart Libraries

### From Victory (if previously used)

```tsx
// Before (Victory)
<VictoryChart>
  <VictoryArea data={data} x="date" y="value" />
</VictoryChart>

// After (Tremor)
<AreaChart
  data={data}
  index="date"
  categories={['value']}
  valueFormatter={formatCurrency}
/>
```

### From Chart.js

```tsx
// Before (Chart.js)
<Line 
  data={chartData} 
  options={chartOptions} 
/>

// After (Tremor)
<LineChart
  data={data}
  index="date"
  categories={['value']}
  colors={['blue']}
/>
```

## Troubleshooting

### Common Issues

1. **Charts not rendering**
   ```tsx
   // Ensure data is properly formatted
   const data = accounts.map(account => ({
     name: account.name,     // String index
     balance: Number(account.balance), // Numeric value
   }));
   ```

2. **Currency formatting issues**
   ```tsx
   // Use consistent number formatting
   const formatCurrency = (value: number): string => {
     if (typeof value !== 'number' || isNaN(value)) return '$0';
     return `$${Intl.NumberFormat('us').format(value)}`;
   };
   ```

3. **Responsive layout problems**
   ```tsx
   // Always wrap in responsive containers
   <div className="w-full overflow-x-auto">
     <AreaChart className="min-w-96" data={data} />
   </div>
   ```

## Resources

- [Tremor Documentation](https://tremor.so/docs)
- [Tremor Blocks (Templates)](https://blocks.tremor.so/)
- [Example Components](/src/domains/ui-system/components/tremor-charts.tsx)
- [Demo Route](/tremor-demo)

---

## Quick Reference

### Most Common Chart Types

| Chart | Import | Key Props |
|-------|--------|-----------|
| Area | `import { AreaChart } from '@tremor/react'` | `data`, `index`, `categories`, `colors` |
| Bar | `import { BarChart } from '@tremor/react'` | `data`, `index`, `categories`, `colors` |
| Line | `import { LineChart } from '@tremor/react'` | `data`, `index`, `categories`, `colors` |
| Donut | `import { DonutChart } from '@tremor/react'` | `data`, `index`, `category`, `colors` |

### Essential Imports

```tsx
import {
  // Charts
  AreaChart, BarChart, LineChart, DonutChart,
  // Layout
  Card, Title, Text, Metric, Flex,
  // Progress
  ProgressBar, CategoryBar,
  // Styling
  Badge
} from '@tremor/react';
```