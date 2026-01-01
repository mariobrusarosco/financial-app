'use client';

import {
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  CategoryBar,
  ProgressBar,
} from '@tremor/react';

// Types for financial data
interface BalanceData {
  date: string;
  checking: number;
  savings: number;
  investment: number;
}

interface TransactionCategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface MonthlySpendingData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface AccountPerformanceData {
  account: string;
  balance: number;
  change: number;
  changeType: 'increase' | 'decrease';
}

// Utility functions
const formatCurrency = (value: number): string =>
  `$${Intl.NumberFormat('us').format(value).toString()}`;

const formatPercentage = (value: number): string => `${value.toFixed(1)}%`;

// Sample data for demonstrations
const balanceTrendData: BalanceData[] = [
  { date: 'Jan 2024', checking: 5420, savings: 12300, investment: 45600 },
  { date: 'Feb 2024', checking: 4890, savings: 13100, investment: 47200 },
  { date: 'Mar 2024', checking: 5680, savings: 13800, investment: 46800 },
  { date: 'Apr 2024', checking: 6200, savings: 14200, investment: 48900 },
  { date: 'May 2024', checking: 5850, savings: 14800, investment: 51200 },
  { date: 'Jun 2024', checking: 6100, savings: 15400, investment: 52800 },
];

const categorySpendingData: TransactionCategoryData[] = [
  { category: 'Food & Dining', amount: 1250, percentage: 28.5 },
  { category: 'Transportation', amount: 850, percentage: 19.3 },
  { category: 'Shopping', amount: 720, percentage: 16.4 },
  { category: 'Bills & Utilities', amount: 680, percentage: 15.5 },
  { category: 'Entertainment', amount: 420, percentage: 9.6 },
  { category: 'Healthcare', amount: 280, percentage: 6.4 },
  { category: 'Other', amount: 200, percentage: 4.6 },
];

const monthlyFlowData: MonthlySpendingData[] = [
  { month: 'Jan', income: 8500, expenses: 6200, savings: 2300 },
  { month: 'Feb', income: 8500, expenses: 5800, savings: 2700 },
  { month: 'Mar', income: 9200, expenses: 6100, savings: 3100 },
  { month: 'Apr', income: 8500, expenses: 6400, savings: 2100 },
  { month: 'May', income: 8500, expenses: 5900, savings: 2600 },
  { month: 'Jun', income: 8800, expenses: 6300, savings: 2500 },
];

const accountPerformanceData: AccountPerformanceData[] = [
  { account: 'Main Checking', balance: 6100, change: 12.3, changeType: 'increase' },
  { account: 'Savings Account', balance: 15400, change: 8.7, changeType: 'increase' },
  { account: 'Investment Portfolio', balance: 52800, change: -2.1, changeType: 'decrease' },
  { account: 'Emergency Fund', balance: 8900, change: 0.0, changeType: 'increase' },
];

// Chart Components
function BalanceTrendChart() {
  return (
    <Card className="max-w-4xl">
      <Title>Account Balance Trends</Title>
      <Text>6-month overview of account balances</Text>
      <AreaChart
        className="h-80 mt-6"
        data={balanceTrendData}
        index="date"
        categories={['checking', 'savings', 'investment']}
        colors={['blue', 'emerald', 'violet']}
        valueFormatter={formatCurrency}
        showLegend={true}
        showGridLines={true}
        curveType="monotone"
      />
    </Card>
  );
}

function SpendingBreakdownChart() {
  return (
    <Card className="max-w-lg">
      <Title>Monthly Spending Breakdown</Title>
      <Text>Distribution by category</Text>
      <DonutChart
        className="h-60 mt-6"
        data={categorySpendingData}
        category="amount"
        index="category"
        valueFormatter={formatCurrency}
        colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber', 'emerald']}
        showLabel={true}
        showAnimation={true}
      />
      <div className="mt-6 space-y-2">
        {categorySpendingData.slice(0, 3).map(item => (
          <div key={item.category} className="flex items-center justify-between">
            <Text className="truncate">{item.category}</Text>
            <div className="flex items-center space-x-2">
              <Text>{formatCurrency(item.amount)}</Text>
              <Badge size="xs" color="gray">
                {formatPercentage(item.percentage)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CashFlowChart() {
  return (
    <Card className="max-w-4xl">
      <Title>Monthly Cash Flow</Title>
      <Text>Income, expenses, and savings over time</Text>
      <BarChart
        className="h-80 mt-6"
        data={monthlyFlowData}
        index="month"
        categories={['income', 'expenses', 'savings']}
        colors={['emerald', 'red', 'blue']}
        valueFormatter={formatCurrency}
        showLegend={true}
        stack={false}
        relative={false}
      />
    </Card>
  );
}

function AccountPerformanceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
      {accountPerformanceData.map(account => (
        <Card key={account.account} className="max-w-xs">
          <Flex alignItems="start">
            <div className="truncate">
              <Text>{account.account}</Text>
              <Metric className="truncate">{formatCurrency(account.balance)}</Metric>
            </div>
            <Badge size="xs" color={account.changeType === 'increase' ? 'emerald' : 'red'}>
              {account.change > 0 ? '+' : ''}
              {formatPercentage(account.change)}
            </Badge>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <Text className="truncate">Performance</Text>
            <Text>{account.changeType === 'increase' ? '↗' : '↘'}</Text>
          </Flex>
          <ProgressBar
            value={Math.abs(account.change)}
            color={account.changeType === 'increase' ? 'emerald' : 'red'}
            className="mt-2"
          />
        </Card>
      ))}
    </div>
  );
}

function SavingsGoalProgress() {
  const currentSavings = 15400;
  const savingsGoal = 20000;
  const progressPercentage = (currentSavings / savingsGoal) * 100;

  return (
    <Card className="max-w-md">
      <Title>Emergency Fund Goal</Title>
      <Text>Progress towards $20,000 target</Text>
      <Metric className="mt-2">{formatCurrency(currentSavings)}</Metric>
      <Text className="mt-1">of {formatCurrency(savingsGoal)}</Text>
      <ProgressBar value={progressPercentage} color="emerald" className="mt-4" />
      <Flex className="mt-2">
        <Text>{formatPercentage(progressPercentage)} complete</Text>
        <Text>{formatCurrency(savingsGoal - currentSavings)} remaining</Text>
      </Flex>
    </Card>
  );
}

function ExpenseTracker() {
  const monthlyBudget = 6000;
  const currentSpending = 4380;
  const categories = [
    { name: 'Food', spent: 1250, budget: 1500 },
    { name: 'Transport', spent: 850, budget: 1000 },
    { name: 'Shopping', spent: 720, budget: 800 },
    { name: 'Bills', spent: 680, budget: 700 },
    { name: 'Entertainment', spent: 420, budget: 600 },
    { name: 'Other', spent: 460, budget: 400 },
  ];

  return (
    <Card className="max-w-md">
      <Title>Monthly Budget Tracker</Title>
      <Text>Spending vs. budget by category</Text>
      <Metric className="mt-2">{formatCurrency(currentSpending)}</Metric>
      <Text className="mt-1">of {formatCurrency(monthlyBudget)} budgeted</Text>

      <div className="mt-6 space-y-4">
        {categories.map(category => {
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
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TransactionVelocityChart() {
  const weeklyData = [
    { day: 'Mon', transactions: 12 },
    { day: 'Tue', transactions: 8 },
    { day: 'Wed', transactions: 15 },
    { day: 'Thu', transactions: 6 },
    { day: 'Fri', transactions: 22 },
    { day: 'Sat', transactions: 18 },
    { day: 'Sun', transactions: 4 },
  ];

  return (
    <Card className="max-w-lg">
      <Title>Weekly Transaction Activity</Title>
      <Text>Number of transactions per day</Text>
      <LineChart
        className="h-60 mt-6"
        data={weeklyData}
        index="day"
        categories={['transactions']}
        colors={['indigo']}
        showLegend={false}
        showGridLines={false}
        curveType="monotone"
      />
    </Card>
  );
}

// Main demo component
function TremorChartsDemo() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Financial Dashboard with Tremor Charts</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive financial analytics using Tremor React components
        </p>
      </div>

      {/* Account Performance Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Account Performance</h2>
        <AccountPerformanceCards />
      </section>

      {/* Balance Trends */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Balance Trends</h2>
        <BalanceTrendChart />
      </section>

      {/* Cash Flow and Spending */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cash Flow Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashFlowChart />
          <div className="space-y-6">
            <SpendingBreakdownChart />
          </div>
        </div>
      </section>

      {/* Goals and Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Goals & Budget Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SavingsGoalProgress />
          <ExpenseTracker />
          <TransactionVelocityChart />
        </div>
      </section>

      {/* Tremor Benefits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tremor React Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <Title className="text-emerald-600">✓ Financial-Ready</Title>
            <Text className="mt-2">
              Built-in currency formatting, percentage displays, and financial color schemes
            </Text>
          </Card>
          <Card>
            <Title className="text-blue-600">✓ Beautiful Defaults</Title>
            <Text className="mt-2">
              Professional-looking charts with minimal configuration required
            </Text>
          </Card>
          <Card>
            <Title className="text-violet-600">✓ Interactive</Title>
            <Text className="mt-2">
              Hover effects, animations, and click handlers for enhanced user experience
            </Text>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Export individual components for use in other parts of the app
export {
  TremorChartsDemo,
  BalanceTrendChart,
  SpendingBreakdownChart,
  CashFlowChart,
  AccountPerformanceCards,
  SavingsGoalProgress,
  ExpenseTracker,
  TransactionVelocityChart,
};
