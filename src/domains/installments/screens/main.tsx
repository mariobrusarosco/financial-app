import { useState } from 'react';
import { useInstallmentPlans } from '@/domains/installments/hooks/use-installment-plans';
import { InstallmentPlanList } from '@/domains/installments/components/installment-plan-list';
import type { I_InstallmentPlansParams } from '@/domains/installments/types/types-and-interfaces';
import { PageHeader } from '@/domains/global/components/page-header';
import { Calendar } from 'lucide-react';
import { InstallmentsSummary } from '@/domains/installments/components/installments-summary';
import { InstallmentsChart } from '@/domains/installments/components/installments-chart';

const ITEMS_PER_PAGE = 20;

export const InstallmentsMainScreen = () => {
  const [params, setParams] = useState<I_InstallmentPlansParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
  });

  const { data: installmentPlansData, states: installmentPlansStates } =
    useInstallmentPlans(params);
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

  const isLoading = isPlansLoading;

  return (
    <div className="space-y-7 pb-8">
      <PageHeader title="Installments" icon={Calendar} />

      <InstallmentsSummary plans={plans} />

      <InstallmentsChart plans={plans} />

      <section
        data-ui="installments-plans-section"
        className="rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] sm:p-6"
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
