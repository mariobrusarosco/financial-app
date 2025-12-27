import { Route } from '@/routes/(auth)/route';
import { useSubscription, useCreateSubscription, useUpdateSubscription } from '../hooks';
import { SubscriptionForm } from './subscription-form';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/domains/ui-system/components/drawer';
import { Loader2 } from 'lucide-react';

const SubscriptionDrawerContent = () => {
  const { subscriptionId } = Route.useSearch();
  const isEditMode = !!subscriptionId;

  // Hooks for fetching data in edit mode and for mutations
  const subscriptionQuery = useSubscription(subscriptionId!);
  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();

  if (isEditMode && subscriptionQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEditMode && subscriptionQuery.isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Failed to load subscription details.</p>
      </div>
    );
  }

  const initialValues = isEditMode ? subscriptionQuery.data?.data : undefined;
  const isLoading = createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending;

  const handleSubmit = (values: any) => {
    if (isEditMode) {
      updateSubscriptionMutation.mutate({ id: subscriptionId!, data: values });
    } else {
      createSubscriptionMutation.mutate(values);
    }
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{isEditMode ? 'Edit Subscription' : 'Create New Subscription'}</DrawerTitle>
        <DrawerDescription>
          {isEditMode
            ? `Editing the details for subscription: ${initialValues?.name}`
            : 'Add a new recurring subscription.'}
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <SubscriptionForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
};

export const SubscriptionDrawer = () => {
  return <SubscriptionDrawerContent />;
};
