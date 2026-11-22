import { useState, type ComponentType } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  ChevronLeft,
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
import { useSidebarState } from '@/domains/ui-system/hooks/use-sidebar-state';
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

/*
 * The sidebar container carries `group/sidebar` and `data-state` (auto | collapsed | expanded).
 * Children are styled as the collapsed icon rail by default and switch to the full layout when
 * the state is `expanded`, or `auto` at the xl breakpoint. Class names stay literal so Tailwind
 * can detect them.
 */
const SHOW_WHEN_EXPANDED =
  'hidden whitespace-nowrap group-data-[state=expanded]/sidebar:block xl:group-data-[state=auto]/sidebar:block';

const NAV_ITEM_LAYOUT =
  'flex h-10 w-full items-center justify-center gap-3 rounded-xl px-0 text-sm transition-colors group-data-[state=expanded]/sidebar:justify-start group-data-[state=expanded]/sidebar:px-3 xl:group-data-[state=auto]/sidebar:justify-start xl:group-data-[state=auto]/sidebar:px-3';

const NAV_ITEM_IDLE =
  'font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground';

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
        'group',
        NAV_ITEM_LAYOUT,
        isActive ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground' : NAV_ITEM_IDLE
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors',
          isActive ? 'text-brand' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
        )}
      />
      <span className={SHOW_WHEN_EXPANDED}>{item.label}</span>
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
    <p
      className={cn(
        'mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase',
        SHOW_WHEN_EXPANDED
      )}
    >
      {label}
    </p>
    {items.map(item => (
      <NavigationLink key={item.href} item={item} onNavigate={onNavigate} />
    ))}
  </div>
);

const SidebarFooter = ({ onNavigate }: { onNavigate?: () => void }) => (
  <div className="space-y-1 border-t border-sidebar-border pt-4">
    <NavigationLink
      item={{ label: 'Settings', href: '/settings', icon: Settings }}
      onNavigate={onNavigate}
    />
    <ThemeButton />
    <LogoutButton />
  </div>
);

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state: sidebarState, isCollapsed, toggle: toggleSidebar } = useSidebarState();

  return (
    <>
      <aside
        data-ui="app-navigation"
        data-state={sidebarState}
        className="group/sidebar hidden w-20 shrink-0 flex-col gap-4 overflow-hidden rounded-3xl bg-sidebar p-3 transition-[width] duration-200 md:my-3 md:ml-3 md:flex data-[state=expanded]:w-72 data-[state=expanded]:p-4 xl:data-[state=auto]:w-72 xl:data-[state=auto]:p-4"
      >
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-sidebar-accent p-2 group-data-[state=expanded]/sidebar:flex-row group-data-[state=expanded]/sidebar:justify-between group-data-[state=expanded]/sidebar:p-3 xl:group-data-[state=auto]/sidebar:flex-row xl:group-data-[state=auto]/sidebar:justify-between xl:group-data-[state=auto]/sidebar:p-3">
          <Brand />
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4 rotate-180 transition-transform group-data-[state=expanded]/sidebar:rotate-0 xl:group-data-[state=auto]/sidebar:rotate-0" />
          </button>
        </div>

        <SidebarProfile />

        <nav className="mt-2 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto">
          <NavigationGroup label="Overview" items={primaryNavigationItems} />
          <NavigationGroup label="Planning" items={planningNavigationItems} />
        </nav>

        <SidebarFooter />
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
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* The mobile drawer always shows the full layout */}
            <nav
              data-state="expanded"
              className="group/sidebar relative flex h-full w-[min(88vw,22rem)] flex-col gap-8 overflow-y-auto border-r border-sidebar-border bg-sidebar p-5 shadow-2xl"
            >
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
              <div className="mt-auto">
                <SidebarFooter onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-lg font-bold text-brand-foreground">
      B
    </span>
    <span
      className={cn(
        'truncate text-base font-semibold tracking-[-0.02em] text-sidebar-foreground',
        compact ? 'block' : SHOW_WHEN_EXPANDED
      )}
    >
      Better Call Buffet
    </span>
  </Link>
);

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Light mode' : 'Dark mode';

  return (
    <button
      type="button"
      title={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(NAV_ITEM_LAYOUT, NAV_ITEM_IDLE)}
    >
      {isDark ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
      <span className={SHOW_WHEN_EXPANDED}>{label}</span>
    </button>
  );
};

const LogoutButton = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const label = isLoggingOut ? 'Logging out…' : 'Log out';

  return (
    <button
      type="button"
      title={label}
      onClick={() => logout()}
      disabled={isLoggingOut}
      className={cn(NAV_ITEM_LAYOUT, NAV_ITEM_IDLE, 'disabled:opacity-50')}
    >
      <LogOut className="h-5 w-5 shrink-0" />
      <span className={SHOW_WHEN_EXPANDED}>{label}</span>
    </button>
  );
};

const UserMenuContent = ({
  name,
  email,
  side,
  align,
}: {
  name: string;
  email: string;
  side?: 'right' | 'bottom';
  align: 'start' | 'end';
}) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <DropdownMenuContent className="w-60" side={side} align={align} forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">{email}</p>
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
  );
};

/** Profile card at the top of the desktop sidebar; shrinks to the avatar when collapsed. */
const SidebarProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-testid="user-menu"
          title={user.name}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sidebar-accent p-2 text-left transition-colors outline-none hover:bg-sidebar-accent/70 focus-visible:ring-2 focus-visible:ring-ring group-data-[state=expanded]/sidebar:justify-start group-data-[state=expanded]/sidebar:p-3 xl:group-data-[state=auto]/sidebar:justify-start xl:group-data-[state=auto]/sidebar:p-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-pastel-peach text-sm font-semibold text-brand">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className={cn('min-w-0 flex-1', SHOW_WHEN_EXPANDED)}>
            <span className="block truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <UserMenuContent name={user.name} email={user.email} side="right" align="start" />
    </DropdownMenu>
  );
};

/** Compact avatar menu used in the mobile header. */
const UserMenu = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid="user-menu" variant="ghost" className="h-auto rounded-xl p-1.5">
          <Avatar className="h-9 w-9 bg-pastel-peach">
            <AvatarFallback className="bg-pastel-peach text-xs font-semibold text-brand">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <UserMenuContent name={user.name} email={user.email} align="end" />
    </DropdownMenu>
  );
};
