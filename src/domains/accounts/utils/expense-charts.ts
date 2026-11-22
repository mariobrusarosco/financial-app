import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  parseISO,
} from 'date-fns';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

// Up to two months reads well day by day; longer ranges are grouped by month
const MAX_DAYS_SHOWN_BY_DAY = 62;
const DAY_KEY_LENGTH = 'yyyy-MM-dd'.length;
const MONTH_KEY_LENGTH = 'yyyy-MM'.length;

export interface I_ExpensesBucket {
  key: string;
  label: string;
  title: string;
  total: number;
  count: number;
}

export interface I_ExpensesByTag {
  id: string | null; // null groups the expenses without a tag
  name: string;
  icon: string | null;
  bg_color: string | null;
  icon_color: string | null;
  total: number;
  count: number;
  expenses: I_TransactionResponse[]; // newest first
}

export interface I_AccountExpensesCharts {
  total: number;
  count: number;
  grouping: 'day' | 'month';
  buckets: I_ExpensesBucket[];
  tags: I_ExpensesByTag[]; // largest first, "No tag" last
}

export const toAccountExpensesCharts = (
  expenses: I_TransactionResponse[],
  dateFrom: string,
  dateTo: string
): I_AccountExpensesCharts => {
  const counted = expenses.filter(byNotIgnored);
  const from = parseISO(dateFrom);
  const to = parseISO(dateTo);
  const grouping =
    differenceInCalendarDays(to, from) + 1 <= MAX_DAYS_SHOWN_BY_DAY ? 'day' : 'month';

  return {
    total: counted.reduce((total, expense) => total + amountOf(expense), 0),
    count: counted.length,
    grouping,
    buckets:
      grouping === 'day'
        ? groupExpensesByDay(counted, from, to)
        : groupExpensesByMonth(counted, from, to),
    tags: rankExpensesByTag(counted),
  };
};

// Ignored transactions stay out, as they do in the account balance
const byNotIgnored = (expense: I_TransactionResponse) => !expense.ignored;

// The API types amounts as text but may send numbers
const amountOf = (expense: I_TransactionResponse) => Number(expense.amount);

const byLargestTotal = (a: I_ExpensesByTag, b: I_ExpensesByTag) => b.total - a.total;

// Dates share one ISO format, so comparing the text orders them
const byNewest = (a: I_TransactionResponse, b: I_TransactionResponse) =>
  b.date.localeCompare(a.date);

const groupExpensesByDay = (expenses: I_TransactionResponse[], from: Date, to: Date) =>
  addToBuckets(
    expenses,
    eachDayOfInterval({ start: from, end: to }).map(day => ({
      key: format(day, 'yyyy-MM-dd'),
      label: format(day, 'MMM d'),
      title: format(day, 'EEE, MMM d, yyyy'),
      total: 0,
      count: 0,
    })),
    DAY_KEY_LENGTH
  );

const groupExpensesByMonth = (expenses: I_TransactionResponse[], from: Date, to: Date) =>
  addToBuckets(
    expenses,
    eachMonthOfInterval({ start: from, end: to }).map(month => ({
      key: format(month, 'yyyy-MM'),
      label: format(month, "MMM ''yy"),
      title: format(month, 'MMMM yyyy'),
      total: 0,
      count: 0,
    })),
    MONTH_KEY_LENGTH
  );

// Every day (or month) of the range gets a bucket, so quiet days show as gaps
const addToBuckets = (
  expenses: I_TransactionResponse[],
  buckets: I_ExpensesBucket[],
  keyLength: number
) => {
  const bucketsByKey = new Map(buckets.map(bucket => [bucket.key, bucket]));

  expenses.forEach(expense => {
    // Dates come as "2026-09-28T00:00:00"; the key is the start of that text
    const bucket = bucketsByKey.get(expense.date.slice(0, keyLength));
    if (!bucket) return;

    bucket.total += amountOf(expense);
    bucket.count += 1;
  });

  return buckets;
};

// A transaction with two tags counts in both, so the tag totals don't add up to the total
const rankExpensesByTag = (expenses: I_TransactionResponse[]) => {
  const tagsById = new Map<string, I_ExpensesByTag>();
  const untagged: I_ExpensesByTag = {
    id: null,
    name: 'No tag',
    icon: null,
    bg_color: null,
    icon_color: null,
    total: 0,
    count: 0,
    expenses: [],
  };

  [...expenses].sort(byNewest).forEach(expense => {
    if (expense.tags.length === 0) {
      addToTag(untagged, expense);
      return;
    }

    expense.tags.forEach(tag => {
      const entry = tagsById.get(tag.id) ?? {
        id: tag.id,
        name: tag.name,
        icon: tag.icon,
        bg_color: tag.bg_color,
        icon_color: tag.icon_color,
        total: 0,
        count: 0,
        expenses: [],
      };
      addToTag(entry, expense);
      tagsById.set(tag.id, entry);
    });
  });

  const ranked = [...tagsById.values()].sort(byLargestTotal);

  return untagged.count > 0 ? [...ranked, untagged] : ranked;
};

const addToTag = (tag: I_ExpensesByTag, expense: I_TransactionResponse) => {
  tag.total += amountOf(expense);
  tag.count += 1;
  tag.expenses.push(expense);
};
