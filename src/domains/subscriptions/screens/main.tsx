import { useState, useMemo } from 'react';
import { Route } from '@/routes/(auth)/route';
import { useSubscriptions } from '@/domains/subscriptions/hooks/index';
import {
  SubscriptionList,
  SubscriptionsSummary,
  SubscriptionsChart,
  SubscriptionsCategoryBreakdown,
} from '@/domains/subscriptions/components/index';
import type { I_SubscriptionsParams } from '@/domains/subscriptions/types/types-and-interfaces';
import { PageHeader } from '@/domains/global/components/page-header';
import { Repeat } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export const SubscriptionsMainScreen = () => {
  const { from, to } = Route.useSearch();
  const [params, setParams] = useState<I_SubscriptionsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'created_at',
    sort_order: 'desc',
    include_summary: true,
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from,
      date_to: to,
    }),
    [params, from, to]
  );

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useSubscriptions(mergedParams);

  const handleParamsChange = (
    newParams: I_SubscriptionsParams | ((prev: I_SubscriptionsParams) => I_SubscriptionsParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 };
    });
  };

  const summary = paginatedData?.meta?.summary;

  return (
    <div className="space-y-7 pb-8">
      <PageHeader title="Subscriptions" icon={Repeat} />

      <SubscriptionsSummary summary={summary} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionsChart data={summary?.monthly_forecast} isLoading={isLoading} />
        <SubscriptionsCategoryBreakdown data={summary?.category_breakdown} isLoading={isLoading} />
      </div>

      <section
        data-ui="subscriptions-list-section"
        className="rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] sm:p-6"
      >
        <SubscriptionList
          subscriptions={paginatedData?.data || []}
          meta={paginatedData?.meta}
          isLoading={isLoading}
          isError={isError}
          isPlaceholderData={isPlaceholderData}
          params={mergedParams}
          onParamsChange={handleParamsChange}
        />
      </section>
    </div>
  );
};
