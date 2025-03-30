import React from 'react';
import { Link } from '@tanstack/react-router';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 transform bg-white shadow-lg transition-transform duration-300 dark:bg-gray-800 md:block">
        <div className="flex h-16 items-center justify-center border-b px-6 dark:border-gray-700">
          <Link to="/" className="text-xl font-display font-bold text-primary-600 dark:text-primary-400">
            Better Call Buffet
          </Link>
        </div>
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            <SidebarLink to="/" icon="home" label="Dashboard" />
            <SidebarLink to="/transactions" icon="credit-card" label="Transactions" />
            <SidebarLink to="/bank-invoice" icon="document-text" label="Bank Invoices" />
            <SidebarLink to="/budgets" icon="chart-pie" label="Budgets" />
            <SidebarLink to="/investments" icon="trending-up" label="Investments" />
            <SidebarLink to="/reports" icon="document-report" label="Reports" />
            <SidebarLink to="/settings" icon="cog" label="Settings" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 bg-white shadow dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon for menu */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 justify-end md:justify-end">
              <div className="flex items-center">
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center">
                        <span className="font-medium">WB</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  // Use the actual path matching from TanStack Router in a real implementation
  const isActive = false;
  
  return (
    <Link
      to={to}
      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-100'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      <span className="mr-3">{/* This would be an actual icon component in reality */}🔹</span>
      {label}
    </Link>
  );
} 