import {
  addDays,
  addMonths,
  format,
  isBefore,
  isSameMonth,
  parseISO,
  startOfMonth,
  isWithinInterval,
} from 'date-fns';
import type { I_Subscription, T_BillingCycle } from '../types/types-and-interfaces';
import type { I_CategoryTreeNode } from '@/domains/categories/types';

/**
 * Normalizes the amount of a subscription to a monthly value based on its billing cycle.
 */
export const normalizeToMonthly = (amount: number, cycle: T_BillingCycle): number => {
  switch (cycle) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.3333; // Average weeks in a month
    case 'monthly':
      return amount;
    case 'annually':
      return amount / 12;
    default:
      return amount;
  }
};

/**
 * Calculates the total monthly burn rate (sum of all active subscriptions normalized to monthly).
 */
export const calculateMonthlyBurnRate = (subscriptions: I_Subscription[]): number => {
  return subscriptions
    .filter((s) => s.is_active)
    .reduce((total, s) => total + normalizeToMonthly(s.amount, s.billing_cycle), 0);
};

/**
 * Projects the yearly cost based on active subscriptions.
 */
export const calculateYearlyProjection = (subscriptions: I_Subscription[]): number => {
  return calculateMonthlyBurnRate(subscriptions) * 12;
};

/**
 * Calculates the total amount due in the next 30 days.
 */
export const calculateDueNext30Days = (subscriptions: I_Subscription[]): number => {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);

  return subscriptions
    .filter((s) => s.is_active)
    .reduce((total, s) => {
      const nextDue = parseISO(s.next_due_date);
      if (isWithinInterval(nextDue, { start: now, end: thirtyDaysFromNow })) {
        return total + s.amount;
      }
      return total;
    }, 0);
};

/**
 * Prepares data for the Annual Cost Forecast bar chart.
 * Groups projected renewals by month for the next 12 months.
 */
export const groupSubscriptionsByMonth = (
  subscriptions: I_Subscription[],
  monthsToForecast = 12
) => {
  const forecast: { month: string; amount: number }[] = [];
  const now = startOfMonth(new Date());

  for (let i = 0; i < monthsToForecast; i++) {
    const targetMonth = addMonths(now, i);
    const monthLabel = format(targetMonth, 'MMM yy');

    let monthlyTotal = 0;
    subscriptions.forEach((s) => {
      if (!s.is_active) return;

      const nextDue = parseISO(s.next_due_date);
      
      // Simple projection logic:
      // If monthly: it occurs every month.
      // If annually: it occurs in the month of next_due_date.
      // If weekly/daily: we normalize to monthly for the chart to keep it consistent.
      
      if (s.billing_cycle === 'monthly') {
        monthlyTotal += s.amount;
      } else if (s.billing_cycle === 'annually') {
        if (isSameMonth(nextDue, targetMonth)) {
          monthlyTotal += s.amount;
        }
      } else {
        // For daily/weekly, we use the monthly normalized value to avoid complex calendar logic
        // but still give a representative "burn" for that month.
        monthlyTotal += normalizeToMonthly(s.amount, s.billing_cycle);
      }
    });

    forecast.push({ month: monthLabel, amount: monthlyTotal });
  }

  return forecast;
};

/**
 * Aggregates normalized monthly costs by category for the donut chart.
 */
export const aggregateSubscriptionsByCategory = (
  subscriptions: I_Subscription[],
  categories: I_CategoryTreeNode[]
) => {
  // 1. Flatten categories using recursive flatMap
  const flatten = (nodes: I_CategoryTreeNode[]): { id: string; name: string }[] =>
    nodes.flatMap((node) => [
      { id: node.id, name: node.name },
      ...(node.children ? flatten(node.children) : []),
    ]);

  const flatCategories = new Map(flatten(categories).map((c) => [c.id, c.name]));

  const categoryMap = new Map<string, number>();

  // 2. Aggregate monthly amounts
  subscriptions.forEach((s) => {
    if (!s.is_active) return;

    const monthlyAmount = normalizeToMonthly(s.amount, s.billing_cycle);
    const categoryId = s.category_id || 'unassigned';
    const categoryName = flatCategories.get(categoryId) || 'Unassigned';
    const current = categoryMap.get(categoryName) || 0;
    categoryMap.set(categoryName, current + monthlyAmount);
  });

  // 3. Convert to array
  return Array.from(categoryMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};
