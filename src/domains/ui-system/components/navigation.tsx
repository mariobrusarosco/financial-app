import { useState, type ComponentType } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  House,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  Repeat2,
  Settings,
  Store,
  Sun,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { useLogout } from '@/domains/auth/hooks/use-logout';
import { Avatar, AvatarFallback } from '@/domains/ui-system/components/avatar';
import { Button } from '@/domains/ui-system/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/domains/ui-system/components/dropdown-menu';
import { useTheme } from '@/domains/ui-system/hooks/use-theme';
import { cn } from '@/domains/ui-system/utils/index';

interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const primaryNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: House },
  { label: 'Accounts', href: '/accounts', icon: PiggyBank },
  { label: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
  { label: 'Cashflow', href: '/cashflow', icon: BarChart3 },
  { label: 'Investments', href: '/investments', icon: TrendingUp },
  { label: 'Vendors', href: '/vendors', icon: Store },
];

const planningNavigationItems: NavigationItem[] = [
  { label: 'Subscriptions', href: '/subscriptions', icon: Repeat2 },
  { label: 'Installments', href: '/installments', icon: CalendarDays },
];

const getInitials = (name: string) => {
  if (!name) return 'U';

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const NavigationLink = ({
  item,
  onNavigate,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

  return (
    <Link
      to={item.href}
      title={item.label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      className={cn(
        'group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
        'md:justify-center md:px-0 xl:justify-start xl:px-3',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-sidebar-foreground'
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors',
          isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      <span className="md:hidden xl:inline">{item.label}</span>
    </Link>
  );
};

const NavigationGroup = ({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: NavigationItem[];
  onNavigate?: () => void;
}) => (
  <div className="space-y-1">
    <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase md:hidden xl:block">
      {label}
    </p>
    {items.map(item => (
      <NavigationLink key={item.href} item={item} onNavigate={onNavigate} />
    ))}
  </div>
);

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <aside
        data-ui="app-navigation"
        className="hidden h-full w-20 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 py-5 md:flex xl:w-60 xl:px-4"
      >
        <Brand />

        <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto">
          <NavigationGroup label="Overview" items={primaryNavigationItems} />
          <NavigationGroup label="Planning" items={planningNavigationItems} />
        </nav>

        <div className="space-y-2 border-t border-sidebar-border pt-4">
          <NavigationLink item={{ label: 'Settings', href: '/settings', icon: Settings }} />
          <ThemeButton />
        </div>
      </aside>

      <div className="md:hidden" data-testid="mobile-navigation">
        <header className="fixed top-7 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur">
          <Brand compact />
          <div className="flex items-center gap-2">
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(current => !current)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 pt-23 md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-[#060429]/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="relative flex h-full w-[min(88vw,22rem)] flex-col gap-8 overflow-y-auto border-r border-border bg-card p-5 shadow-2xl">
              <NavigationGroup
                label="Overview"
                items={primaryNavigationItems}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
              <NavigationGroup
                label="Planning"
                items={planningNavigationItems}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
              <div className="mt-auto space-y-2 border-t border-border pt-4">
                <NavigationLink
                  item={{ label: 'Settings', href: '/settings', icon: Settings }}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
                <ThemeButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export const AppTopBar = () => (
  <header className="hidden h-20 shrink-0 items-center justify-end gap-6 border-b border-border/70 bg-background px-6 md:flex lg:px-8">
    <UserMenu showIdentity />
  </header>
);

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-lg font-bold text-brand-foreground shadow-sm">
      B
    </span>
    <span
      className={cn(
        'truncate text-sm font-semibold tracking-[-0.03em] text-sidebar-foreground',
        compact ? 'block' : 'hidden xl:block'
      )}
    >
      Better Call Buffet
    </span>
  </Link>
);

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground md:justify-center md:px-0 xl:justify-start xl:px-3"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="md:hidden xl:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
};

const UserMenu = ({ showIdentity = false }: { showIdentity?: boolean }) => {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="user-menu"
          variant="ghost"
          className={cn('h-auto rounded-xl p-1.5', showIdentity && 'gap-3 pr-3')}
        >
          <Avatar className="h-9 w-9 border border-brand/15 bg-pastel-blue">
            <AvatarFallback className="bg-pastel-blue text-xs font-semibold text-brand">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {showIdentity && (
            <span className="hidden min-w-0 text-left lg:block">
              <span className="block max-w-40 truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block max-w-40 truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
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
            Profile and settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout()} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
