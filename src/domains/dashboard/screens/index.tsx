import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import type { ReactNode } from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileUp,
  Plus,
  ReceiptText,
  Repeat2,
  TriangleAlert,
  Users,
  WalletCards,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useDashboard } from '@/domains/dashboard/hooks/use-dashboard';
import {
  formatCurrencyAmount,
  formatDateMedium,
  parseCurrencyAmount,
} from '@/domains/global/utils/formatting';
import { Button } from '@/domains/ui-system/components/button';
import { MoneyValue } from '@/domains/ui-system/components/money-value';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { StatTile } from '@/domains/ui-system/components/stat-tile';
import { cn } from '@/domains/ui-system/utils/index';

type DashboardData = ReturnType<typeof useDashboard>['data'];
type DashboardStates = ReturnType<typeof useDashboard>['states'];
type DashboardHandlers = ReturnType<typeof useDashboard>['handlers'];

export const DashboardIndexScreen = () => {
  const { data, states, handlers } = useDashboard();

  return (
    <div data-testid="dashboard-index-screen" className="space-y-7 pb-8">
      <DashboardHeader
        firstName={data.firstName}
        onNewTransaction={handlers.openTransactionCreate}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <KeyFigures data={data} states={states} />
          <CashflowPanel data={data} states={states} />
          <QuickActions handlers={handlers} />
          <ScheduledPayments data={data} states={states} />
          <VendorPanel data={data} states={states} />
        </div>

        <aside className="space-y-6">
          <CreditCardPanel data={data} states={states} handlers={handlers} />
          <RecentTransactions data={data} states={states} />
        </aside>
      </div>
    </div>
  );
};

const DashboardHeader = ({
  firstName,
  onNewTransaction,
}: {
  firstName: string;
  onNewTransaction: () => void;
}) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        Welcome back · {format(new Date(), 'EEEE, MMM d')}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
        Hi, {firstName}
      </h1>
    </div>
    <Button onClick={onNewTransaction}>
      <Plus className="h-4 w-4" />
      New transaction
    </Button>
  </header>
);

const QuickActions = ({ handlers }: { handlers: DashboardHandlers }) => {
  const actions = [
    {
      label: 'New transaction',
      description: 'Record income or spending',
      icon: ArrowUpRight,
      className: 'bg-pastel-blue text-brand',
      onClick: handlers.openTransactionCreate,
    },
    {
      label: 'New account',
      description: 'Connect another balance',
      icon: Building2,
      className: 'bg-pastel-green text-positive',
      onClick: handlers.openAccountCreate,
    },
    {
      label: 'New card',
      description: 'Track a credit card',
      icon: CreditCard,
      className: 'bg-pastel-violet text-accent-foreground',
      onClick: handlers.openCreditCardCreate,
    },
  ];

  return (
    <section aria-labelledby="quick-actions-title">
      <SectionHeading id="quick-actions-title" title="Quick actions" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={cn(
                'group flex min-h-28 flex-col items-start justify-between rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                action.className
              )}
            >
              <Icon className="h-5 w-5" />
              <span>
                <span className="block text-sm font-semibold text-foreground">{action.label}</span>
                <span className="mt-0.5 block text-xs text-foreground/60">
                  {action.description}
                </span>
              </span>
            </button>
          );
        })}

        <Link
          to="/accounts"
          className="group flex min-h-28 flex-col items-start justify-between rounded-2xl bg-pastel-peach p-4 text-left text-brand transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <FileUp className="h-5 w-5" />
          <span>
            <span className="block text-sm font-semibold text-foreground">Upload statement</span>
            <span className="mt-0.5 block text-xs text-foreground/60">Choose an account first</span>
          </span>
        </Link>
      </div>
    </section>
  );
};

const KeyFigures = ({ data, states }: { data: DashboardData; states: DashboardStates }) => {
  const [primaryBalance, ...otherBalances] = data.balances;
  const cashflow = data.cashflow;

  return (
    <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2">
      <StatTile
        label="Active account balances"
        isLoading={states.isAccountsLoading}
        value={
          states.isAccountsError ? (
            <span className="text-base font-medium text-destructive">Unavailable</span>
          ) : (
            <MoneyValue amount={primaryBalance?.balance ?? 0} currency={primaryBalance?.currency} />
          )
        }
        hint={
          otherBalances.length > 0
            ? `+ ${otherBalances
                .map(balance =>
                  formatCurrencyAmount(balance.balance, { currency: balance.currency })
                )
                .join(' · ')} (not converted)`
            : `${data.accountCount} active ${data.accountCount === 1 ? 'account' : 'accounts'}`
        }
      />
      <StatTile
        label="Net cashflow this month"
        isLoading={states.isCashflowLoading}
        value={<MoneyValue amount={cashflow?.net_cashflow ?? 0} />}
      />
      <StatTile
        label="Income this month"
        isLoading={states.isCashflowLoading}
        value={<MoneyValue amount={cashflow?.total_income ?? 0} />}
      />
      <StatTile
        label="Expenses this month"
        isLoading={states.isCashflowLoading}
        value={<MoneyValue amount={cashflow?.total_expenses ?? 0} />}
      />
    </section>
  );
};

const CashflowPanel = ({ data, states }: { data: DashboardData; states: DashboardStates }) => (
  <section
    aria-labelledby="cashflow-title"
    className="rounded-3xl border border-border bg-card p-5 sm:p-6"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="cashflow-title" className="text-xl font-semibold tracking-[-0.02em] text-foreground">
        Cashflow: <span className="font-normal text-muted-foreground">This month</span>
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-sm text-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[4px] bg-chart-1" /> Income
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[4px] bg-chart-4" /> Expenses
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/cashflow">
            View cashflow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>

    <div className="mt-6">
      {states.isCashflowLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : states.isCashflowError ? (
        <DashboardEmptyState message="Cashflow is temporarily unavailable." />
      ) : data.cashflow?.monthly_data.length ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.cashflow.monthly_data} barGap={6}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                dy={8}
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)' }}
                contentStyle={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--popover)',
                  color: 'var(--popover-foreground)',
                }}
              />
              <Bar dataKey="income" name="Income" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--chart-4)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DashboardEmptyState message="No cashflow activity is available for this period." />
      )}
    </div>
  </section>
);

const ScheduledPayments = ({ data, states }: { data: DashboardData; states: DashboardStates }) => (
  <section aria-labelledby="scheduled-title">
    <SectionHeading id="scheduled-title" title="Scheduled payments" />
    <div className="mt-3 grid gap-4 lg:grid-cols-2">
      <ScheduledCard
        title="Subscriptions"
        icon={Repeat2}
        href="/subscriptions"
        isLoading={states.isSubscriptionsLoading}
        isError={states.isSubscriptionsError}
        isEmpty={data.subscriptions.length === 0}
      >
        {data.subscriptions.map(subscription => (
          <li key={subscription.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{subscription.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDateMedium(subscription.next_due_date)}
              </p>
            </div>
            <div className="text-right">
              <p className="financial-value text-sm font-semibold text-foreground">
                {formatCurrencyAmount(subscription.amount, { currency: subscription.currency })}
              </p>
              <StatusLabel isPaid={subscription.is_paid_this_cycle} />
            </div>
          </li>
        ))}
      </ScheduledCard>

      <ScheduledCard
        title="Installments"
        icon={ReceiptText}
        href="/installments"
        isLoading={states.isInstallmentsLoading}
        isError={states.isInstallmentsError}
        isEmpty={data.installments.length === 0}
      >
        {data.installments.map(installment => (
          <li key={installment.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{installment.planName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDateMedium(installment.dueDate)} · {installment.installmentNumber}/
                {installment.installmentCount}
              </p>
            </div>
            <div className="text-right">
              <p className="financial-value text-sm font-semibold text-foreground">
                {formatCurrencyAmount(installment.amount)}
              </p>
              <StatusLabel isOverdue={installment.status === 'overdue'} />
            </div>
          </li>
        ))}
      </ScheduledCard>
    </div>
  </section>
);

const ScheduledCard = ({
  title,
  icon: Icon,
  href,
  isLoading,
  isError,
  isEmpty,
  children,
}: {
  title: string;
  icon: typeof Repeat2;
  href: '/subscriptions' | '/installments';
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  children: ReactNode;
}) => (
  <div className="min-h-72 rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <Link to={href} className="text-xs font-semibold text-brand hover:underline">
        View all
      </Link>
    </div>
    <div className="mt-4 min-h-48">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <DashboardEmptyState message={`We couldn't load ${title.toLowerCase()}.`} compact />
      ) : isEmpty ? (
        <DashboardEmptyState message={`No ${title.toLowerCase()} are due soon.`} compact />
      ) : (
        <ul className="divide-y divide-border/70">{children}</ul>
      )}
    </div>
  </div>
);

const VendorPanel = ({ data, states }: { data: DashboardData; states: DashboardStates }) => (
  <section className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Users className="h-5 w-5 text-brand" />
        <h2 className="text-base font-semibold text-foreground">Vendors and payees</h2>
      </div>
      <Link to="/vendors" className="text-xs font-semibold text-brand hover:underline">
        Manage
      </Link>
    </div>

    {states.isVendorsLoading ? (
      <div className="mt-5 flex gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-36" />
        ))}
      </div>
    ) : data.vendors.length > 0 ? (
      <ul className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {data.vendors.map(vendor => (
          <li
            key={vendor.id}
            className="flex min-w-40 items-center gap-3 rounded-xl bg-muted/65 p-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-xs font-semibold text-brand">
              {vendor.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium text-foreground">{vendor.name}</span>
          </li>
        ))}
      </ul>
    ) : (
      <DashboardEmptyState
        message="Add vendors to make recurring activity easier to recognize."
        compact
      />
    )}
  </section>
);

const CreditCardPanel = ({
  data,
  states,
  handlers,
}: {
  data: DashboardData;
  states: DashboardStates;
  handlers: DashboardHandlers;
}) => {
  const creditCard = data.creditCards[0];

  return (
    <section aria-labelledby="cards-title">
      <div className="flex items-center justify-between">
        <SectionHeading id="cards-title" title="My card" />
        <button
          type="button"
          onClick={handlers.openCreditCardCreate}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
          aria-label="Add credit card"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {states.isCreditCardsLoading ? (
        <Skeleton className="mt-3 aspect-[1.58/1] w-full rounded-3xl" />
      ) : creditCard ? (
        <div className="relative mt-3 aspect-[1.58/1] overflow-hidden rounded-3xl bg-spotlight p-6 text-spotlight-foreground">
          <div className="absolute -top-16 -right-12 h-48 w-48 rounded-full border-[36px] border-white/10" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/70">Credit limit</p>
                <p className="financial-value mt-1 text-xl font-semibold">
                  {formatCurrencyAmount(creditCard.credit_limit)}
                </p>
              </div>
              <WalletCards className="h-6 w-6 text-white/85" />
            </div>
            <div>
              <p className="font-mono text-base tracking-[0.18em] text-white/90">
                •••• •••• •••• {creditCard.last_four_digits}
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] tracking-wider text-white/60 uppercase">Card</p>
                  <p className="mt-0.5 text-sm font-medium">{creditCard.name}</p>
                </div>
                <p className="text-sm font-semibold capitalize">{creditCard.brand}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlers.openCreditCardCreate}
          className="mt-3 flex aspect-[1.58/1] w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-brand/35 bg-pastel-blue/50 text-center transition-colors hover:bg-pastel-blue"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-brand shadow-sm">
            <Plus className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">Add your first card</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Track invoices and spending
            </span>
          </span>
        </button>
      )}
    </section>
  );
};

const RecentTransactions = ({ data, states }: { data: DashboardData; states: DashboardStates }) => (
  <section className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-3">
      <SectionHeading id="recent-transactions-title" title="Recent activity" />
      <Link to="/transactions" className="text-xs font-semibold text-brand hover:underline">
        View all
      </Link>
    </div>

    {states.isTransactionsLoading ? (
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    ) : states.isTransactionsError ? (
      <DashboardEmptyState message="Recent activity is temporarily unavailable." compact />
    ) : data.transactionGroups.length > 0 ? (
      <div className="mt-4 space-y-5">
        {data.transactionGroups.map(group => (
          <div key={group.label}>
            <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="divide-y divide-border/70">
              {group.transactions.map(transaction => {
                const isIncome = transaction.movement_type === 'income';
                const value = formatCurrencyAmount(
                  Math.abs(parseCurrencyAmount(transaction.amount))
                );

                return (
                  <li key={transaction.id} className="flex items-center gap-3 py-3">
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                        isIncome ? 'bg-pastel-green text-positive' : 'bg-pastel-peach text-brand'
                      )}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {transaction.tags?.length
                          ? transaction.tags.map(tag => tag.name).join(' · ')
                          : 'No tags'}
                      </p>
                    </div>
                    <p
                      className={cn(
                        'financial-value text-sm font-semibold',
                        isIncome ? 'text-positive' : 'text-foreground'
                      )}
                    >
                      {isIncome ? '+' : '−'}
                      {value}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <DashboardEmptyState message="Your latest transactions will appear here." compact />
    )}
  </section>
);

const StatusLabel = ({
  isPaid = false,
  isOverdue = false,
}: {
  isPaid?: boolean;
  isOverdue?: boolean;
}) => {
  const Icon = isPaid ? CheckCircle2 : isOverdue ? TriangleAlert : CircleDollarSign;
  const label = isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Due';

  return (
    <span
      className={cn(
        'mt-1 inline-flex items-center gap-1 text-[0.65rem] font-semibold',
        isPaid ? 'text-positive' : isOverdue ? 'text-destructive' : 'text-warning'
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const SectionHeading = ({ id, title }: { id: string; title: string }) => (
  <h2 id={id} className="text-base font-semibold tracking-[-0.015em] text-foreground">
    {title}
  </h2>
);

const DashboardEmptyState = ({
  message,
  compact = false,
}: {
  message: string;
  compact?: boolean;
}) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-xl bg-muted/50 px-4 text-center text-sm text-muted-foreground',
      compact ? 'mt-4 min-h-32' : 'min-h-56'
    )}
  >
    {message}
  </div>
);
