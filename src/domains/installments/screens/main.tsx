import { useState } from 'react';
import { useInstallmentPlans } from '@/domains/installments/hooks/use-installment-plans';
import { InstallmentPlanList } from '../components/installment-plan-list';
import type { I_InstallmentPlansParams } from '../types/types-and-interfaces';
import { PageHeader } from '@/domains/global/components/page-header';
import { Calendar } from 'lucide-react';
import { InstallmentsSummary } from '../components/installments-summary';
import { InstallmentsChart } from '../components/installments-chart';
import { InstallmentsCategoryBreakdown } from '../components/installments-category-breakdown';
import { useCategories } from '@/domains/categories/hooks/use-categories';

const ITEMS_PER_PAGE = 20;

export const InstallmentsMainScreen = () => {
  const [params, setParams] = useState<I_InstallmentPlansParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
  });

  const { data: installmentPlansData, states: installmentPlansStates } =
    useInstallmentPlans(params);
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { plans, totalCount, page, perPage } = installmentPlansData;
  const {
    isLoading: isPlansLoading,
    isError: isPlansError,
    isPlaceholderData,
  } = installmentPlansStates;

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

  const isLoading = isPlansLoading || isCategoriesLoading;

  return (
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
          totalCount={totalCount}
          page={page}
          perPage={perPage}
          isLoading={isLoading}
          isError={isPlansError}
          isPlaceholderData={isPlaceholderData}
          params={params}
          onParamsChange={handleParamsChange}
        />
      </section>
    </div>
  );
};
