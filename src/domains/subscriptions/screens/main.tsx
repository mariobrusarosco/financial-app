import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router'; // useNavigate is still from @tanstack/react-router
import { Route } from '@/routes/(auth)/route'; // Correct import for global Route access
import { useSubscriptions } from '../hooks';
import { SubscriptionList } from '../components'; // Will create this component next
import { CardDescription } from '@/domains/ui-system/components/card';
import { Loader2, Repeat } from 'lucide-react';
import type { I_SubscriptionsParams } from '../types/types-and-interfaces';
import { Surface } from '@/domains/global/components/surface';
import { PageHeader } from '@/domains/global/components';

const ITEMS_PER_PAGE = 20;

export const SubscriptionsMainScreen = () => {
  const navigate = useNavigate();
  const { from, to } = Route.useSearch(); // Global dates
  const [params, setParams] = useState<I_SubscriptionsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from, // Include global date filter
      date_to: to,     // Include global date filter
    }),
    [params, from, to] // Add from, to to dependencies
  );

  const { data, isLoading, isError, isPlaceholderData } = useSubscriptions(mergedParams);

  const subscriptions = data?.data || [];
  const meta = data?.meta;

  const handleParamsChange = (
    newParams: I_SubscriptionsParams | ((prev: I_SubscriptionsParams) => I_SubscriptionsParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 }; // Reset to page 1 on filter changes
    });
  };

  if (isError) {
    return (
      <Surface data-ui="subscriptions-main-screen" className="w-full flex-1">
        <PageHeader
          title="Subscriptions"
          icon={Repeat}
          onAdd={() => navigate({ to: '/subscriptions/create' })}
          addButtonLabel="Add Subscription"
        />
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load subscriptions</p>
        </div>
      </Surface>
    );
  }

  return (
    <Surface data-ui="subscriptions-main-screen" className="w-full flex-1 space-y-4">
      <PageHeader
        title="Subscriptions"
        icon={Repeat}
        onAdd={() => navigate({ to: '/subscriptions/create' })}
        addButtonLabel="Add Subscription"
      />
      <CardDescription>
        {isLoading && !isPlaceholderData ? (
          'Loading subscriptions...'
        ) : (
          <>
            {meta
              ? `${meta.total} subscriptions found`
              : 'Manage your list of recurring subscriptions.'}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Loading new data...)</span>
            )}
          </>
        )}
      </CardDescription>

      {isLoading && !isPlaceholderData ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SubscriptionList
          subscriptions={subscriptions}
          meta={meta}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          params={mergedParams}
          onParamsChange={handleParamsChange}
        />
      )}
    </Surface>
  );
};
