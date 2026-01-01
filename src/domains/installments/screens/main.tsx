import { useState } from 'react';
import { Route } from '@/routes/(auth)/installments/index';
import { useInstallmentPlans } from '../hooks/use-installments';
import { InstallmentPlanList } from '../components/installment-plan-list';
import type { I_InstallmentPlansParams } from '../types/types-and-interfaces';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';
import { PageHeader } from '@/domains/global/components/page-header';
import { Calendar } from 'lucide-react';
import { InstallmentsSummary } from '../components/installments-summary';
import { InstallmentsChart } from '../components/installments-chart';
import { InstallmentsCategoryBreakdown } from '../components/installments-category-breakdown';
import { useCategories } from '@/domains/categories/hooks/use-categories';

const ITEMS_PER_PAGE = 20;

export const InstallmentsMainScreen = () => {
  const { drawer } = Route.useSearch();
  const [params, setParams] = useState<I_InstallmentPlansParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
  });

  const { data: plansData, isLoading: isPlansLoading, isError: isPlansError, isPlaceholderData } = useInstallmentPlans(params);
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const handleParamsChange = (
    newParams:
      | I_InstallmentPlansParams
      | ((prev: I_InstallmentPlansParams) => I_InstallmentPlansParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 };
    });
  };

  const plans = plansData?.data || [];
  const isLoading = isPlansLoading || isCategoriesLoading;

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Installments" icon={Calendar} />

        <InstallmentsSummary plans={plans} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstallmentsChart plans={plans} />
          <InstallmentsCategoryBreakdown plans={plans} categories={categories} />
        </div>

        <section
          data-ui="installments-plans-section"
          className="bg-section-background rounded-3xl p-6"
        >
          <InstallmentPlanList
            plans={plans}
            totalCount={plansData?.meta?.total}
            page={plansData?.meta?.page}
            perPage={plansData?.meta?.per_page}
            isLoading={isLoading}
            isError={isPlansError}
            isPlaceholderData={isPlaceholderData}
            params={params}
            onParamsChange={handleParamsChange}
          />
        </section>
      </div>

      {(drawer === 'installment-plan-create' || drawer === 'installment-plan-edit') && (
        <GlobalDrawer drawerType={drawer} />
      )}
    </>
  );
};
