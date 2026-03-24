import { useInstallmentPlans } from '@/domains/installments/hooks/use-installment-plans';
import type {
  I_Installment,
  I_InstallmentPlan,
} from '@/domains/installments/types/types-and-interfaces';
import { isSameMonth, parseISO, startOfMonth } from 'date-fns';

const currentMonth = startOfMonth(new Date());

const getUpcomingInstallments = (plans: I_InstallmentPlan[]) => {
  return plans.flatMap(plan =>
    plan.installments
      .filter(byOutstanding)
      .filter(byCurrentMonth)
      .sort(byAscDueDate)
      .map(toInstallmentAndPlanName(plan))
      .slice(0, MAX_INSTALLMENTS_TO_DISPLAY)
  );
};

export const useUpcomingInstallments = () => {
  const installmentPlansQuery = useInstallmentPlans({ status: 'active', per_page: 100 });
  const installments = getUpcomingInstallments(installmentPlansQuery.data.plans);

  return {
    data: {
      installments,
    },
    states: {
      isLoading: installmentPlansQuery.states.isLoading,
      isError: installmentPlansQuery.states.isError,
      isEmpty:
        !installmentPlansQuery.states.isLoading &&
        !installmentPlansQuery.states.isError &&
        installments?.length === 0,
    },
    handlers: {},
  };
};

const byCurrentMonth = (installment: I_Installment) =>
  isSameMonth(parseISO(installment.due_date), currentMonth);

const byOutstanding = (installment: I_Installment) => installment.status !== 'linked';

const toInstallmentAndPlanName = (plan: I_InstallmentPlan) => (installment: I_Installment) => ({
  id: installment.id,
  planName: plan.name,
  dueDate: installment.due_date,
  amount: installment.amount,
  status: installment.status,
  installmentNumber: installment.number,
  installmentCount: plan.installment_count,
});

const byAscDueDate = (firstInstallment: I_Installment, secondInstallment: I_Installment) =>
  new Date(firstInstallment.due_date).getTime() - new Date(secondInstallment.due_date).getTime();

const MAX_INSTALLMENTS_TO_DISPLAY = 5;
