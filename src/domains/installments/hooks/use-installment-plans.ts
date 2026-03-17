import { useQuery } from '@tanstack/react-query';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import type { I_InstallmentPlansParams } from '@/domains/installments/types/types-and-interfaces';

export const useInstallmentPlans = (params?: I_InstallmentPlansParams) => {
  const queryParams = params ? { ...params } : undefined;
  const installmentPlansQuery = useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planList(queryParams),
    queryFn: () => installmentsApi.getPlans(params),
  });
  const plans = installmentPlansQuery.data?.data ?? [];
  const meta = installmentPlansQuery.data?.meta;

  return {
    data: {
      plans,
      totalCount: meta?.total ?? 0,
      page: meta?.page ?? params?.page ?? 1,
      perPage: meta?.per_page ?? params?.per_page ?? 0,
    },
    states: {
      isLoading: installmentPlansQuery.isLoading,
      isError: installmentPlansQuery.isError,
      isPlaceholderData: installmentPlansQuery.isPlaceholderData,
      isEmpty:
        !installmentPlansQuery.isLoading && !installmentPlansQuery.isError && plans.length === 0,
    },
    handlers: {},
  };
};
