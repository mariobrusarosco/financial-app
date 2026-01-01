import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/domains/ui-system/utils/index';
import { Button } from '@/domains/ui-system/components/button';
import { ModeToggle } from '@/domains/ui-system/components/mode-toggle';
import {
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
  Receipt,
  User,
  LogOut,
  House,
  PiggyBank,
  Store, // New icon for Vendors
  Repeat, // New icon for Subscriptions
  Calendar, // New icon for Installments
} from 'lucide-react';
import { useState } from 'react';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@/domains/ui-system/components/avatar';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { useLogout } from '@/domains/auth/hooks/use-logout';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: House,
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: PiggyBank,
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
    label: 'Vendors', // New item
    href: '/vendors',
    icon: Store,
  },
  {
    label: 'Subscriptions', // New item
    href: '/subscriptions',
    icon: Repeat,
  },
  {
    label: 'Installments', // New item
    href: '/installments',
    icon: Calendar,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: User,
  },
];

const UserMenu = () => {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => logout()}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      <nav
        data-ui="app-navigation"
        className="hidden md:flex md:flex-col md:justify-center md:items-center bg-primary rounded-r-3xl font-sans
        text-neutral-white"
      >
        <nav className="flex flex-col px-2 h-fit gap-6">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                title={item.label}
                className={cn(
                  'group flex items-center justify-center p-3 rounded-lg transition-colors',
                  isActive ? 'bg-neutral-white/10' : 'hover:bg-neutral-white/10'
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </nav>

      <div className="md:hidden">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="ml-2 text-lg font-thin font-sans text-foreground">
              Better Call Buffet
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <UserMenu />
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
