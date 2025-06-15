import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/domains/ui-system/utils/index';
import { Button } from '@/domains/ui-system/components/button';
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: CreditCard,
  },
  {
    label: 'Brokers',
    href: '/brokers',
    icon: Building2,
  },
  {
    label: 'Investments',
    href: '/investments',
    icon: TrendingUp,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200 md:pt-5 md:pb-4 md:overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="/wb.png" alt="Better Call Buffet" className="w-10 h-10" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Better Call Buffet</span>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-rose-100 text-rose-900 border-r-2 border-rose-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">Better Call Buffet</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-10 w-10"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <nav className="fixed top-16 left-0 right-0 bottom-0 flex flex-col w-full max-w-xs bg-white shadow-xl">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="px-2 space-y-1">
                  {navigationItems.map(item => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-rose-100 text-rose-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <Icon
                          className={cn(
                            'mr-4 flex-shrink-0 h-6 w-6',
                            isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};
