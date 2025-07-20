import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/domains/ui-system/utils/index';
import { Button } from '@/domains/ui-system/components/button';
import { ModeToggle } from '@/domains/ui-system/components/mode-toggle';
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
  Receipt,
} from 'lucide-react';
import { useState } from 'react';
import * as React from 'react';

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
    label: 'Transactions',
    href: '/transactions',
    icon: Receipt,
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
      <nav className="hidden md:flex md:justify-between md:w-full md:p-3 md:px-4 md:items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/wb.png" alt="Better Call Buffet" className="w-4 h-4" />
          <span className="text-sm font-bold text-foreground">Better Call Buffet</span>
        </Link>

        <nav className="flex px-2 h-fit gap-2">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center text-sm px-4 py-2 rounded-md transition-colors',
                  isActive
                    ? 'text-primary border-b-1 border-primary'
                    : 'text-muted-foreground hover:text-accent-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-4 w-4',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-accent-foreground'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ModeToggle />
      </nav>

      <div className="md:hidden">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="ml-2 text-lg font-bold text-foreground">Better Call Buffet</span>
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-10 w-10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <nav className="fixed top-16 left-0 right-0 bottom-0 flex flex-col w-full max-w-xs bg-card shadow-xl">
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
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon
                          className={cn(
                            'mr-4 flex-shrink-0 h-6 w-6',
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-accent-foreground'
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
