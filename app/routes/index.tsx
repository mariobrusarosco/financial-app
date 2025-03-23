import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout";

// Define the route
export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Welcome to Better Call Buffet, your financial dashboard
          </p>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">$24,563.21</p>
            <div className="mt-2 flex items-center text-sm text-success-600 dark:text-success-400">
              <span>↑ 2.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">$8,942.00</p>
            <div className="mt-2 flex items-center text-sm text-success-600 dark:text-success-400">
              <span>↑ 4.3%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">$5,638.12</p>
            <div className="mt-2 flex items-center text-sm text-danger-600 dark:text-danger-400">
              <span>↑ 1.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">36.9%</p>
            <div className="mt-2 flex items-center text-sm text-success-600 dark:text-success-400">
              <span>↑ 3.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all
            </a>
          </div>
          <div className="mt-6 overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <TransactionItem
                name="Grocery Store"
                amount="-$56.42"
                date="Today"
                category="Food & Dining"
                status="completed"
              />
              <TransactionItem
                name="Monthly Salary"
                amount="+$4,500.00"
                date="Yesterday"
                category="Income"
                status="completed"
              />
              <TransactionItem
                name="Electric Bill"
                amount="-$78.25"
                date="Mar 21, 2023"
                category="Utilities"
                status="completed"
              />
              <TransactionItem
                name="Amazon"
                amount="-$35.84"
                date="Mar 19, 2023"
                category="Shopping"
                status="completed"
              />
              <TransactionItem
                name="Investment Deposit"
                amount="-$500.00"
                date="Mar 18, 2023"
                category="Investments"
                status="pending"
              />
            </ul>
          </div>
        </div>

        {/* Quote of the Day */}
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <blockquote className="text-lg font-medium text-gray-900 dark:text-white">
            "The most important investment you can make is in yourself."
            <footer className="mt-2 text-sm text-gray-600 dark:text-gray-400">— Warren Buffett</footer>
          </blockquote>
        </div>
      </div>
    </MainLayout>
  );
}

interface TransactionItemProps {
  name: string;
  amount: string;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

function TransactionItem({ name, amount, date, category, status }: TransactionItemProps) {
  return (
    <li className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{category}</span>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-sm font-medium ${
            amount.startsWith('+')
              ? 'text-success-600 dark:text-success-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {amount}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
          <span
            className={`inline-flex h-1.5 w-1.5 rounded-full ${
              status === 'completed'
                ? 'bg-success-500'
                : status === 'pending'
                ? 'bg-warning-500'
                : 'bg-danger-500'
            }`}
          />
        </div>
      </div>
    </li>
  );
}
