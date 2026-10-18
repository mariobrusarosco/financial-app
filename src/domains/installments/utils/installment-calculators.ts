import {
  addMonths,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';

/**
 * Calculates the total outstanding debt from all active installment plans.
 * "Outstanding" means installments with status !== 'linked'.
 */
export const calculateTotalOutstandingDebt = (plans: I_InstallmentPlan[]): number => {
  return plans.reduce((total, plan) => {
    // Only count active or overdue plans for future liability
    if (plan.status === 'cancelled' || plan.status === 'finished') return total;
    
    const outstandingInPlan = plan.installments
      ?.filter(i => i.status !== 'linked')
      .reduce((sum, i) => sum + i.amount, 0) || 0;
      
    return total + outstandingInPlan;
  }, 0);
};

/**
 * Calculates the total liability for the next calendar month.
 */
export const calculateNextMonthLiability = (plans: I_InstallmentPlan[]): number => {
  const nextMonth = addMonths(new Date(), 1);
  
  return plans.reduce((total, plan) => {
    if (plan.status === 'cancelled' || plan.status === 'finished') return total;
    
    const nextMonthInPlan = plan.installments
      ?.filter(i => i.status !== 'linked' && isSameMonth(parseISO(i.due_date), nextMonth))
      .reduce((sum, i) => sum + i.amount, 0) || 0;
      
    return total + nextMonthInPlan;
  }, 0);
};

/**
 * Calculates the total liability for the current calendar month.
 */
export const calculateCurrentMonthLiability = (plans: I_InstallmentPlan[]): number => {
  const currentMonth = startOfMonth(new Date());
  
  return plans.reduce((total, plan) => {
    if (plan.status === 'cancelled' || plan.status === 'finished') return total;
    
    const currentMonthInPlan = plan.installments
      ?.filter(i => i.status !== 'linked' && isSameMonth(parseISO(i.due_date), currentMonth))
      .reduce((sum, i) => sum + i.amount, 0) || 0;
      
    return total + currentMonthInPlan;
  }, 0);
};

/**
 * Groups future installments by month for charting.
 * Returns an array of { month: string, amount: number } for the next 12 months.
 */
export const groupFutureInstallmentsByMonth = (plans: I_InstallmentPlan[], monthsToForecast = 12) => {
  const forecast: { month: string; amount: number }[] = [];
  const now = startOfMonth(new Date());

  for (let i = 0; i < monthsToForecast; i++) {
    const targetMonth = addMonths(now, i);
    const monthLabel = format(targetMonth, 'MMM yy');
    
    let monthlyTotal = 0;
    plans.forEach(plan => {
      if (plan.status === 'cancelled' || plan.status === 'finished') return;
      
      const installmentsInMonth = plan.installments
        ?.filter(inst => 
          inst.status !== 'linked' && 
          isSameMonth(parseISO(inst.due_date), targetMonth)
        ) || [];
        
      monthlyTotal += installmentsInMonth.reduce((sum, inst) => sum + inst.amount, 0);
    });

    forecast.push({ month: monthLabel, amount: monthlyTotal });
  }

  return forecast;
};
