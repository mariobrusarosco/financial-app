import { useState, useMemo } from 'react';
import { Route } from '@/routes/(auth)/route';
import { useSubscriptions } from '../hooks';
import { SubscriptionList } from '../components';
import type { I_SubscriptionsParams } from '../types/types-and-interfaces';

const ITEMS_PER_PAGE = 20;

export const SubscriptionsMainScreen = () => {
  const { from, to } = Route.useSearch();
  const [params, setParams] = useState<I_SubscriptionsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from,
      date_to: to,
    }),
    [params, from, to]
  );

  const { data, isLoading, isError, isPlaceholderData } = useSubscriptions(mergedParams);

  const handleParamsChange = (
    newParams: I_SubscriptionsParams | ((prev: I_SubscriptionsParams) => I_SubscriptionsParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 };
    });
  };

  return (
    <SubscriptionList
      subscriptions={data?.data || []}
      meta={data?.meta}
      isLoading={isLoading}
      isError={isError}
      isPlaceholderData={isPlaceholderData}
      params={mergedParams}
      onParamsChange={handleParamsChange}
    />
  );
};
