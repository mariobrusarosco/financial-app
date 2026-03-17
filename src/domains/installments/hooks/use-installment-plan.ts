import { useQuery } from '@tanstack/react-query';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';

export const useInstallmentPlan = (planId: string | undefined, installmentId?: string) => {
  const installmentPlanId = planId ?? '';
  const installmentPlanQuery = useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planDetail(installmentPlanId),
    queryFn: () => installmentsApi.getPlan(installmentPlanId),
    enabled: Boolean(planId),
  });
  const installment = installmentPlanQuery.data?.installments.find(
    currentInstallment => currentInstallment.id === installmentId
  );

  const isEmpty =
    !installmentPlanQuery.isLoading &&
    !installmentPlanQuery.isError &&
    (!installmentPlanQuery.data || (Boolean(installmentId) && !installment));

  return {
    data: {
      plan: installmentPlanQuery.data,
      installment,
    },
    states: {
      isLoading: installmentPlanQuery.isLoading,
      isError: installmentPlanQuery.isError,
      isEmpty,
    },
    handlers: {},
  };
};
