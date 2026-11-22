import { describe, expect, it } from 'vitest';
import type { I_Subscription } from '../types/types-and-interfaces';
import {
  getChargeDatesInMonth,
  getChargesOnDay,
  getMonthCharges,
  toDayKey,
} from './subscription-charges';

const TRAINER_DUE_DATE = '2026-12-02';

const buildSubscription = (overrides: Partial<I_Subscription> = {}): I_Subscription => ({
  id: 'sub-1',
  user_id: 'user-1',
  vendor_id: 'vendor-1',
  account_id: null,
  credit_card_id: null,
  name: 'Personal Trainer',
  amount: 700,
  currency: 'BRL',
  billing_cycle: 'monthly',
  next_due_date: TRAINER_DUE_DATE,
  is_active: true,
  is_paid_this_cycle: true,
  tag_ids: [],
  tags: [],
  created_at: '2026-01-10T12:00:00',
  updated_at: '2026-01-10T12:00:00',
  ...overrides,
});

const NOVEMBER = new Date(2026, 10, 1);
const DECEMBER = new Date(2026, 11, 1);
const TODAY = new Date(2026, 10, 22);

const toDayKeys = (dates: Date[]) => dates.map(toDayKey).sort();

describe('getChargeDatesInMonth', () => {
  it('finds the next due date in its own month', () => {
    expect(toDayKeys(getChargeDatesInMonth(buildSubscription(), DECEMBER))).toEqual([
      TRAINER_DUE_DATE,
    ]);
  });

  it('goes back one cycle at a time for past months', () => {
    expect(toDayKeys(getChargeDatesInMonth(buildSubscription(), NOVEMBER))).toEqual(['2026-11-02']);
  });

  it('does not go back before the month the subscription was added', () => {
    const subscription = buildSubscription({ created_at: '2026-11-10T12:00:00' });

    expect(toDayKeys(getChargeDatesInMonth(subscription, NOVEMBER))).toEqual(['2026-11-02']);
    expect(getChargeDatesInMonth(subscription, new Date(2026, 9, 1))).toEqual([]);
  });

  it('shows a yearly plan only in its renewal month', () => {
    const subscription = buildSubscription({
      billing_cycle: 'yearly',
      next_due_date: '2027-04-05',
    });

    expect(toDayKeys(getChargeDatesInMonth(subscription, new Date(2027, 3, 1)))).toEqual([
      '2027-04-05',
    ]);
    expect(getChargeDatesInMonth(subscription, DECEMBER)).toEqual([]);
    expect(toDayKeys(getChargeDatesInMonth(subscription, new Date(2028, 3, 1)))).toEqual([
      '2028-04-05',
    ]);
  });

  it('shows a quarterly plan every three months', () => {
    const subscription = buildSubscription({
      billing_cycle: 'quarterly',
      next_due_date: '2026-12-15',
    });

    expect(getChargeDatesInMonth(subscription, new Date(2027, 1, 1))).toEqual([]);
    expect(toDayKeys(getChargeDatesInMonth(subscription, new Date(2027, 2, 1)))).toEqual([
      '2027-03-15',
    ]);
  });

  it('shows every week of a weekly plan', () => {
    const subscription = buildSubscription({
      billing_cycle: 'weekly',
      next_due_date: '2026-12-03',
    });

    expect(toDayKeys(getChargeDatesInMonth(subscription, DECEMBER))).toEqual([
      '2026-12-03',
      '2026-12-10',
      '2026-12-17',
      '2026-12-24',
      '2026-12-31',
    ]);
  });

  it('moves a day the month does not have to its last day, like the backend', () => {
    const subscription = buildSubscription({ next_due_date: '2027-01-31' });

    expect(toDayKeys(getChargeDatesInMonth(subscription, new Date(2027, 1, 1)))).toEqual([
      '2027-02-28',
    ]);
  });
});

describe('getMonthCharges', () => {
  it('marks past cycles as paid and future ones as upcoming', () => {
    const { charges } = getMonthCharges([buildSubscription()], NOVEMBER, TODAY);
    const december = getMonthCharges([buildSubscription()], DECEMBER, TODAY);

    expect(charges.map(charge => charge.status)).toEqual(['paid']);
    expect(december.charges.map(charge => charge.status)).toEqual(['upcoming']);
  });

  it('marks a past due date with no linked payment as overdue', () => {
    const subscription = buildSubscription({
      next_due_date: '2026-11-05',
      is_paid_this_cycle: false,
    });

    const { charges } = getMonthCharges([subscription], NOVEMBER, TODAY);

    expect(charges.map(charge => charge.status)).toEqual(['overdue']);
  });

  it('counts a charge due today as upcoming', () => {
    const subscription = buildSubscription({
      next_due_date: '2026-11-22',
      is_paid_this_cycle: false,
    });

    const { charges } = getMonthCharges([subscription], NOVEMBER, TODAY);

    expect(charges.map(charge => charge.status)).toEqual(['upcoming']);
  });

  it('sorts by date, groups by day, sums the month and names the payment source', () => {
    const trainer = buildSubscription({ credit_card_id: 'card-1' });
    const gym = buildSubscription({
      id: 'sub-2',
      name: 'Gym',
      amount: 150,
      next_due_date: TRAINER_DUE_DATE,
      account_id: 'account-1',
    });
    const streaming = buildSubscription({
      id: 'sub-3',
      name: 'Streaming',
      amount: 55.9,
      next_due_date: '2026-12-01',
    });

    const result = getMonthCharges([trainer, gym, streaming], DECEMBER, TODAY, {
      'card-1': 'Nubank',
      'account-1': 'Itaú',
    });

    expect(result.charges.map(charge => charge.subscription.name)).toEqual([
      'Streaming',
      'Gym',
      'Personal Trainer',
    ]);
    expect(result.charges.map(charge => charge.paymentSourceName)).toEqual([
      null,
      'Itaú',
      'Nubank',
    ]);
    expect(getChargesOnDay(result.chargesByDay, new Date(2026, 11, 2))).toHaveLength(2);
    expect(getChargesOnDay(result.chargesByDay, new Date(2026, 11, 3))).toEqual([]);
    expect(result.total).toBeCloseTo(905.9);
  });
});
