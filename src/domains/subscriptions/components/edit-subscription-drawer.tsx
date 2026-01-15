import { useNavigate } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Route } from '@/routes/(auth)/route';
import { useUpdateSubscription } from '../hooks';
import { subscriptionsApi } from '../api/subscriptions.api';
import { SUBSCRIPTIONS_QUERY_KEYS } from '../api/keys';
import { SubscriptionForm } from './subscription-form';
import { Loader2, Save, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import type { I_Subscription } from '../types/types-and-interfaces';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { useState } from 'react';
import { LinkPaymentDrawer } from './link-payment-drawer';

export const EditSubscriptionDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { subscriptionId } = Route.useSearch();
  const [isLinkingPayment, setIsLinkingPayment] = useState(false);

  // 1. Transaction Pattern: Try to find the subscription in the list cache first
  const cachedSubscriptionsData = queryClient.getQueriesData<{
    data: I_Subscription[];
  }>({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.lists(),
  });

  const cachedSubscription = cachedSubscriptionsData
    .flatMap(([, data]) => data?.data ?? [])
    .find(sub => sub.id === subscriptionId);

  // 2. Fetch data if not in cache, using cached item as initialData
  const {
    data: subscription,
    isLoading: isQueryLoading,
    isError,
  } = useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(subscriptionId!),
    queryFn: () => subscriptionsApi.getSubscription(subscriptionId!),
    enabled: !!subscriptionId,
    initialData: cachedSubscription as any,
  });

  const updateSubscriptionMutation = useUpdateSubscription();

  const closeDrawer = () => {
    navigate({ search: (prev: any) => ({ ...prev, drawer: undefined, subscriptionId: undefined }) });
  };

  const handleSubmit = (values: any) => {
    if (subscriptionId) {
      updateSubscriptionMutation.mutate(
        { id: subscriptionId, data: values },
        { onSuccess: closeDrawer }
      );
    }
  };

  const isLoading = updateSubscriptionMutation.isPending || isQueryLoading;

  if (isQueryLoading && !subscription) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <DrawerHeader
          title="Edit Subscription"
          description="Loading subscription details..."
          icon={Save}
        />
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !subscription) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <DrawerHeader
          title="Edit Subscription"
          description="Failed to load subscription details."
          icon={Save}
        />
      </div>
    );
  }

  if (isLinkingPayment) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 pb-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsLinkingPayment(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
        </div>
        <LinkPaymentDrawer 
          subscription={subscription} 
          onClose={() => {
            setIsLinkingPayment(false);
            // Invalidate to refresh the history list
            queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(subscriptionId!) });
          }} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Edit Subscription"
          icon={Save}
        />
        <div className="flex gap-2">
          {!subscription.is_paid_this_cycle && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsLinkingPayment(true)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
          <Button size="lg" form="subscription-form" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-6">
              Edit the details of your subscription.
            </p>
            <SubscriptionForm
              key={subscription.id}
              initialValues={subscription as unknown as I_Subscription}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
