'use client';

import * as React from 'react';
import {
  AreaChart,
  BarChart,
  LineChart,
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  ProgressBar,
  Tracker,
} from '@tremor/react';

// Types for financial data
interface BalanceData {
  date: string;
  checking: number;
  savings: number;
  investment: number;
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
            <div size="xs" color={account.changeType === 'increase' ? 'emerald' : 'red'}>
              {account.change > 0 ? '+' : ''}
              {formatPercentage(account.change)}
            </div>
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
        </div>
      </section>

      {/* Goals and Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Goals & Budget Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SavingsGoalProgress />
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
  CashFlowChart,
  AccountPerformanceCards,
  SavingsGoalProgress,
  TransactionVelocityChart,
};
