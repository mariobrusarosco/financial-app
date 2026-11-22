import {
  addMonths,
  addWeeks,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  subMonths,
  subWeeks,
} from 'date-fns';
import type { I_Subscription, T_BillingCycle } from '../types/types-and-interfaces';

// paid: a past cycle (the backend only moves next_due_date forward once a payment is linked)
// overdue: on or after next_due_date and already in the past, so no payment was linked for it
// upcoming: on or after next_due_date, from today on
export type T_ChargeStatus = 'paid' | 'upcoming' | 'overdue';

export interface I_SubscriptionCharge {
  subscription: I_Subscription;
  date: Date;
  status: T_ChargeStatus;
  paymentSourceName: string | null;
}

export interface I_MonthCharges {
  charges: I_SubscriptionCharge[];
  chargesByDay: Record<string, I_SubscriptionCharge[]>;
  total: number;
}

const MONTHS_PER_CYCLE: Record<Exclude<T_BillingCycle, 'weekly'>, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

// Same steps as the backend's _calculate_next_due_date: date-fns clamps to the end of the month (Jan 31 -> Feb 28) like its add_months
const toNextChargeDate = (date: Date, cycle: T_BillingCycle) =>
  cycle === 'weekly' ? addWeeks(date, 1) : addMonths(date, MONTHS_PER_CYCLE[cycle]);

const toPreviousChargeDate = (date: Date, cycle: T_BillingCycle) =>
  cycle === 'weekly' ? subWeeks(date, 1) : subMonths(date, MONTHS_PER_CYCLE[cycle]);

export const toDayKey = (date: Date) => format(date, 'yyyy-MM-dd');

/**
 * Every date the subscription charges within the month of `month`, worked out from next_due_date.
 * Past cycles only go back to the month the subscription was added, so older months stay empty.
 */
export const getChargeDatesInMonth = (subscription: I_Subscription, month: Date) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const nextDueDate = parseISO(subscription.next_due_date);
  const trackedSince = startOfMonth(parseISO(subscription.created_at));
  const cycle = subscription.billing_cycle;
  const dates: Date[] = [];

  for (let date = nextDueDate; !isAfter(date, monthEnd); date = toNextChargeDate(date, cycle)) {
    if (!isBefore(date, monthStart)) dates.push(date);
  }

  for (
    let date = toPreviousChargeDate(nextDueDate, cycle);
    !isBefore(date, monthStart) && !isBefore(date, trackedSince);
    date = toPreviousChargeDate(date, cycle)
  ) {
    if (!isAfter(date, monthEnd)) dates.push(date);
  }

  return dates;
};

const toChargeStatus = (date: Date, nextDueDate: Date, today: Date): T_ChargeStatus => {
  if (isBefore(date, nextDueDate)) return 'paid';
  if (isBefore(date, today)) return 'overdue';
  return 'upcoming';
};

const byAscDateThenName = (a: I_SubscriptionCharge, b: I_SubscriptionCharge) =>
  a.date.getTime() - b.date.getTime() || a.subscription.name.localeCompare(b.subscription.name);

/**
 * The month's charges of every subscription, in date order.
 * `today` must be the start of the day, so a charge due today counts as upcoming.
 */
export const getMonthCharges = (
  subscriptions: I_Subscription[],
  month: Date,
  today: Date,
  paymentSourceNames: Record<string, string> = {}
): I_MonthCharges => {
  const charges = subscriptions
    .flatMap(subscription => {
      const nextDueDate = parseISO(subscription.next_due_date);
      const paymentSourceId = subscription.credit_card_id ?? subscription.account_id;
      const paymentSourceName = paymentSourceId
        ? (paymentSourceNames[paymentSourceId] ?? null)
        : null;

      return getChargeDatesInMonth(subscription, month).map(date => ({
        subscription,
        date,
        status: toChargeStatus(date, nextDueDate, today),
        paymentSourceName,
      }));
    })
    .sort(byAscDateThenName);

  return {
    charges,
    chargesByDay: groupChargesByDay(charges),
    total: sumChargeAmounts(charges),
  };
};

const groupChargesByDay = (charges: I_SubscriptionCharge[]) =>
  charges.reduce<Record<string, I_SubscriptionCharge[]>>((chargesByDay, charge) => {
    const dayKey = toDayKey(charge.date);
    chargesByDay[dayKey] = [...(chargesByDay[dayKey] ?? []), charge];
    return chargesByDay;
  }, {});

export const sumChargeAmounts = (charges: I_SubscriptionCharge[]) =>
  charges.reduce((total, charge) => total + charge.subscription.amount, 0);

export const getChargesOnDay = (chargesByDay: Record<string, I_SubscriptionCharge[]>, day: Date) =>
  chargesByDay[toDayKey(day)] ?? [];
