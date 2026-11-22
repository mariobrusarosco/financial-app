import { useNavigate } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Route } from '@/routes/(auth)/route';
import { useUpdateSubscription } from '../hooks';
import { subscriptionsApi } from '../api/subscriptions.api';
import { SUBSCRIPTIONS_QUERY_KEYS } from '../api/keys';
import { SubscriptionForm } from './subscription-form';
import { Loader2, Link as LinkIcon, Repeat2 } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import type { I_Subscription } from '../types/types-and-interfaces';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
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

  const isSaving = updateSubscriptionMutation.isPending;

  if (isQueryLoading && !subscription) {
    return (
      <DrawerLayout data-ui="edit-subscription-drawer">
        <DrawerLayoutHeader
          icon={Repeat2}
          title="Edit subscription"
          description="Loading subscription details…"
        />
        <DrawerLayoutBody className="grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  if (isError || !subscription) {
    return (
      <DrawerLayout data-ui="edit-subscription-drawer">
        <DrawerLayoutHeader icon={Repeat2} title="Edit subscription" />
        <DrawerLayoutBody>
          <p className="text-sm text-destructive">Failed to load subscription details.</p>
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  if (isLinkingPayment) {
    return (
      <LinkPaymentDrawer
        subscription={subscription}
        onClose={() => {
          setIsLinkingPayment(false);
          // Invalidate to refresh the history list
          queryClient.invalidateQueries({
            queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(subscriptionId!),
          });
        }}
      />
    );
  }

  return (
    <DrawerLayout data-ui="edit-subscription-drawer">
      <DrawerLayoutHeader icon={Repeat2} title="Edit subscription" description={subscription.name} />
      <DrawerLayoutBody>
        <SubscriptionForm
          key={subscription.id}
          initialValues={subscription as unknown as I_Subscription}
          onSubmit={handleSubmit}
        />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        {!subscription.is_paid_this_cycle && (
          <Button type="button" variant="outline" onClick={() => setIsLinkingPayment(true)}>
            <LinkIcon className="h-4 w-4" />
            Mark as paid
          </Button>
        )}
        <Button type="submit" form="subscription-form" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
