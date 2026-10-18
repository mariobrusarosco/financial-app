import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isSameDay,
  isValid,
  parse,
  startOfMonth,
} from 'date-fns';
import type { I_MonthlyCashflow } from '@/domains/cashflow/types/index';

const URL_DATE_FORMAT = 'yyyy-MM-dd';
const MONTH_KEY_FORMAT = 'yyyy-MM';
export const TREND_MONTHS = 6;

export interface I_Period {
  from: string;
  to: string;
}

// `parse` (not parseISO) keeps "2026-10-01" as local midnight instead of shifting the day
export const parseUrlDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const date = parse(value, URL_DATE_FORMAT, new Date());
  return isValid(date) ? date : undefined;
};

const toUrlDate = (date: Date) => format(date, URL_DATE_FORMAT);

export const isFullMonth = (from: Date, to: Date) =>
  isSameDay(from, startOfMonth(from)) && isSameDay(to, endOfMonth(from));

/**
 * The period right before `from`–`to`, used for "vs previous" comparisons.
 * A full month compares with the previous full month; any other range with the
 * same number of days immediately before it.
 */
export const getPreviousPeriod = (
  fromValue?: string,
  toValue?: string
): (I_Period & { label: string }) | undefined => {
  const from = parseUrlDate(fromValue);
  const to = parseUrlDate(toValue);
  if (!from || !to) return undefined;

  if (isFullMonth(from, to)) {
    const previousMonth = addMonths(from, -1);
    return {
      from: toUrlDate(startOfMonth(previousMonth)),
      to: toUrlDate(endOfMonth(previousMonth)),
      label: `vs ${format(previousMonth, 'MMM')}`,
    };
  }

  const lengthInDays = differenceInCalendarDays(to, from) + 1;
  return {
    from: toUrlDate(addDays(from, -lengthInDays)),
    to: toUrlDate(addDays(from, -1)),
    label: 'vs previous period',
  };
};

/** The last TREND_MONTHS full months, ending with the month of `toValue`. */
export const getTrendPeriod = (toValue?: string): I_Period => {
  const endMonth = startOfMonth(parseUrlDate(toValue) ?? new Date());
  return {
    from: toUrlDate(addMonths(endMonth, -(TREND_MONTHS - 1))),
    to: toUrlDate(endOfMonth(endMonth)),
  };
};

/** One entry per month of the period (months the API skipped come back as zeros). */
export const fillMonthlySeries = (
  data: I_MonthlyCashflow[],
  period: I_Period
): I_MonthlyCashflow[] => {
  const start = startOfMonth(parseUrlDate(period.from) ?? new Date());
  const end = startOfMonth(parseUrlDate(period.to) ?? new Date());
  const byMonth = new Map(data.map(month => [month.month, month]));
  const series: I_MonthlyCashflow[] = [];

  for (let month = start; month <= end; month = addMonths(month, 1)) {
    const key = format(month, MONTH_KEY_FORMAT);
    series.push(
      byMonth.get(key) ?? { month: key, income: 0, expenses: 0, savings: 0, investments: 0 }
    );
  }

  return series;
};

/** Whether a 'yyyy-MM' month overlaps the selected period. */
export const isMonthInPeriod = (monthKey: string, fromValue?: string, toValue?: string) => {
  const from = parseUrlDate(fromValue);
  const to = parseUrlDate(toValue);
  const month = parse(monthKey, MONTH_KEY_FORMAT, new Date());
  if (!from || !to || !isValid(month)) return false;
  return month <= to && endOfMonth(month) >= from;
};

/** Percent change, or undefined when there's nothing to compare against. */
export const getPercentChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) return undefined;
  return ((current - previous) / Math.abs(previous)) * 100;
};
