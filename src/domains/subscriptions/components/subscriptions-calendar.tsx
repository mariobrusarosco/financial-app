import { createContext, useContext, useState } from 'react';
import type { ComponentProps } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { format, startOfMonth } from 'date-fns';
import { X } from 'lucide-react';
import { Calendar, CalendarDayButton } from '@/domains/ui-system/components/calendar';
import { Button } from '@/domains/ui-system/components/button';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { MoneyValue } from '@/domains/ui-system/components/money-value';
import { cn } from '@/domains/ui-system/utils';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { useSubscriptionCharges } from '../hooks/use-subscription-charges';
import { getChargesOnDay, sumChargeAmounts } from '../utils/subscription-charges';
import type {
  I_MonthCharges,
  I_SubscriptionCharge,
  T_ChargeStatus,
} from '../utils/subscription-charges';
import type { T_BillingCycle } from '../types/types-and-interfaces';

const MAX_DOTS_PER_DAY = 3;

const CHARGE_STATUSES: T_ChargeStatus[] = ['paid', 'upcoming', 'overdue'];

const DOT_CLASS_BY_STATUS: Record<T_ChargeStatus, string> = {
  paid: 'bg-positive',
  upcoming: 'bg-chart-1',
  overdue: 'bg-destructive',
};

const STATUS_LABEL: Record<T_ChargeStatus, string> = {
  paid: 'Paid',
  upcoming: 'Upcoming',
  overdue: 'Overdue',
};

const BILLING_CYCLE_LABEL: Record<T_BillingCycle, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

// The calendar renders its own day cells, so they read the month's charges from here
const ChargesByDayContext = createContext<Record<string, I_SubscriptionCharge[]>>({});

export const SubscriptionsCalendar = () => {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const {
    charges: { query },
  } = useSubscriptionCharges(month);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    setSelectedDay(undefined);
  };

  return (
    <section
      data-ui="subscriptions-calendar-section"
      className="rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] sm:p-6"
    >
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Charges in {format(month, 'MMMM')}</h2>
          <p className="text-sm text-muted-foreground">
            Each dot is a subscription charged on that day.
          </p>
        </div>
        <ul className="flex items-center gap-4 text-xs text-muted-foreground">
          {CHARGE_STATUSES.map(status => (
            <li key={status} className="flex items-center gap-1.5">
              <StatusDot status={status} />
              {STATUS_LABEL[status]}
            </li>
          ))}
        </ul>
      </header>

      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <ChargesByDayContext.Provider value={query.data?.chargesByDay ?? {}}>
          <Calendar
            mode="single"
            month={month}
            onMonthChange={handleMonthChange}
            selected={selectedDay}
            onSelect={setSelectedDay}
            showOutsideDays={false}
            components={{ DayButton: ChargeDayButton }}
            className="mx-auto bg-transparent p-0 [--cell-size:--spacing(11)]"
          />
        </ChargesByDayContext.Provider>

        <ChargeList
          query={query}
          month={month}
          selectedDay={selectedDay}
          onClearDay={() => setSelectedDay(undefined)}
        />
      </div>
    </section>
  );
};

const StatusDot = ({ status, className }: { status: T_ChargeStatus; className?: string }) => (
  <span className={cn('size-1.5 shrink-0 rounded-full', DOT_CLASS_BY_STATUS[status], className)} />
);

// A day of the calendar with a dot in its top-right corner for each subscription charged on it
const ChargeDayButton = ({ children, ...props }: ComponentProps<typeof CalendarDayButton>) => {
  const chargesByDay = useContext(ChargesByDayContext);
  const charges = getChargesOnDay(chargesByDay, props.day.date);
  const hiddenCount = charges.length - MAX_DOTS_PER_DAY;

  return (
    <CalendarDayButton {...props} className={cn('relative', props.className)}>
      {children}
      {charges.length > 0 && (
        <span className="absolute right-1 top-1 flex items-center gap-0.5 opacity-100!">
          {charges.slice(0, MAX_DOTS_PER_DAY).map(charge => (
            <StatusDot
              key={charge.subscription.id}
              status={charge.status}
              // Keeps the dot visible on the selected day's dark background
              className="in-data-[selected-single=true]:ring-1 in-data-[selected-single=true]:ring-primary-foreground"
            />
          ))}
          {hiddenCount > 0 && (
            <span className="text-[0.6rem] leading-none text-muted-foreground">+{hiddenCount}</span>
          )}
          <span className="sr-only">
            , {charges.length} {charges.length === 1 ? 'charge' : 'charges'}
          </span>
        </span>
      )}
    </CalendarDayButton>
  );
};

interface ChargeListProps {
  query: UseQueryResult<I_MonthCharges>;
  month: Date;
  selectedDay?: Date;
  onClearDay: () => void;
}

const ChargeList = ({ query, month, selectedDay, onClearDay }: ChargeListProps) => {
  if (query.isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        We couldn&apos;t load your subscription charges.
      </p>
    );
  }

  const charges = selectedDay
    ? getChargesOnDay(query.data.chargesByDay, selectedDay)
    : query.data.charges;
  const title = selectedDay
    ? `Charges on ${format(selectedDay, 'MMM d')}`
    : `All charges in ${format(month, 'MMMM yyyy')}`;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {selectedDay && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearDay}
              aria-label="Show the whole month"
            >
              <X className="h-4 w-4" />
              Whole month
            </Button>
          )}
        </div>
        <MoneyValue amount={sumChargeAmounts(charges)} className="text-xl font-semibold" />
      </div>

      {charges.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          {selectedDay ? 'Nothing is charged on this day.' : 'Nothing is charged this month.'}
        </p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-y-auto">
          {charges.map(charge => (
            <ChargeRow key={`${charge.subscription.id}-${charge.date.getTime()}`} charge={charge} />
          ))}
        </ul>
      )}
    </div>
  );
};

const ChargeRow = ({ charge }: { charge: I_SubscriptionCharge }) => {
  const { subscription, date, status, paymentSourceName } = charge;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5">
      <div className="w-10 shrink-0 text-center">
        <p className="text-[0.7rem] uppercase text-muted-foreground">{format(date, 'EEE')}</p>
        <p className="text-lg font-semibold leading-tight">{format(date, 'd')}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{subscription.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {BILLING_CYCLE_LABEL[subscription.billing_cycle]}
          {paymentSourceName && ` · ${paymentSourceName}`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="financial-value font-semibold">{formatCurrencyAmount(subscription.amount)}</p>
        <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <StatusDot status={status} />
          {STATUS_LABEL[status]}
        </p>
      </div>
    </li>
  );
};
