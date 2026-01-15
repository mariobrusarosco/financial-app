import { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { I_MonthlyCashflow, I_CashflowSummary } from '../types';
import { format, parseISO, startOfMonth } from 'date-fns';

export const aggregateCashflowData = (transactions: I_TransactionResponse[]): I_CashflowSummary => {
  const monthlyMap = new Map<string, I_MonthlyCashflow>();

  let totalIncome = 0;
  let totalExpenses = 0;

  // Filter out ignored transactions
  const activeTransactions = transactions.filter(t => !t.ignored);

  activeTransactions.forEach(t => {
    const date = parseISO(t.date);
    const monthKey = format(startOfMonth(date), 'yyyy-MM');
    const amount = parseFloat(t.amount);

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        income: 0,
        expenses: 0,
        savings: 0,
        investments: 0,
      });
    }

    const monthlyData = monthlyMap.get(monthKey)!;

    if (t.movement_type === 'income') {
      monthlyData.income += amount;
      totalIncome += amount;
    } else if (t.movement_type === 'expense') {
      monthlyData.expenses += Math.abs(amount);
      totalExpenses += Math.abs(amount);
    } else if (t.movement_type === 'investment') {
      monthlyData.investments += Math.abs(amount);
    }

    monthlyData.savings = monthlyData.income - monthlyData.expenses;
  });

  const monthly_data = Array.from(monthlyMap.values()).sort((a, b) => 
    a.month.localeCompare(b.month)
  );

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_cashflow: totalIncome - totalExpenses,
    savings_rate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
    monthly_data,
  };
};
