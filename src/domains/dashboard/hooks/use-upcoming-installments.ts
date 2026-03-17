import { useInstallmentPlans } from '@/domains/installments/hooks/use-installment-plans';
import type { I_InstallmentPlan } from '@/domains/installments/types/types-and-interfaces';

export const useUpcomingInstallments = () => {
  const installmentPlansQuery = useInstallmentPlans({ status: 'active', per_page: 100 });
  const installments = sortUpcomingInstallments(installmentPlansQuery.data.plans);

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
        installments.length === 0,
    },
    handlers: {},
  };
};

const sortUpcomingInstallments = (plans: I_InstallmentPlan[]) => {
  return plans
    .flatMap(plan =>
      plan.installments
        .filter(installment => installment.status !== 'linked')
        .map(installment => ({
          id: installment.id,
          planName: plan.name,
          dueDate: installment.due_date,
          amount: installment.amount,
          status: installment.status,
          installmentNumber: installment.number,
          installmentCount: plan.installment_count,
        }))
    )
    .sort(
      (firstInstallment, secondInstallment) =>
        new Date(firstInstallment.dueDate).getTime() - new Date(secondInstallment.dueDate).getTime()
    )
    .slice(0, 5);
};
