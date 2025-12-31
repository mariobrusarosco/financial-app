import { useState, useMemo } from 'react';
import { Route } from '@/routes/(auth)/installments/index';
import { useInstallmentPlans } from '../hooks/use-installments';
import { InstallmentPlanList } from '../components/installment-plan-list';
import type { I_InstallmentPlansParams } from '../types/types-and-interfaces';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';

const ITEMS_PER_PAGE = 20;

export const InstallmentsMainScreen = () => {
  const { drawer, planId } = Route.useSearch();
  const [params, setParams] = useState<I_InstallmentPlansParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
  });

  const { data, isLoading, isError, isPlaceholderData } = useInstallmentPlans(params);

  const handleParamsChange = (
    newParams: I_InstallmentPlansParams | ((prev: I_InstallmentPlansParams) => I_InstallmentPlansParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 };
    });
  };

  return (
    <>
      <InstallmentPlanList
        plans={data?.items || []}
        totalCount={data?.total_count}
        page={data?.page}
        perPage={data?.per_page}
        isLoading={isLoading}
        isError={isError}
        isPlaceholderData={isPlaceholderData}
        params={params}
        onParamsChange={handleParamsChange}
      />
      {(drawer === 'installment-create' || drawer === 'installment-edit') && (
        <GlobalDrawer drawerType={drawer} />
      )}
    </>
  );
};
