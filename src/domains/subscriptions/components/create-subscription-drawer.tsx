import { useNavigate } from '@tanstack/react-router';
import { Loader2, Repeat2 } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import { useCreateSubscription } from '../hooks';
import { SubscriptionForm } from './subscription-form';

export const CreateSubscriptionDrawer = () => {
  const navigate = useNavigate();
  const createSubscriptionMutation = useCreateSubscription();

  const closeDrawer = () => {
    navigate({ search: (prev: any) => ({ ...prev, drawer: undefined, subscriptionId: undefined }) });
  };

  const handleSubmit = (values: any) => {
    createSubscriptionMutation.mutate(values, { onSuccess: closeDrawer });
  };

  const isLoading = createSubscriptionMutation.isPending;

  return (
    <DrawerLayout data-ui="create-subscription-drawer">
      <DrawerLayoutHeader
        icon={Repeat2}
        title="New subscription"
        description="A recurring payment you want to keep an eye on."
      />
      <DrawerLayoutBody>
        <SubscriptionForm key="create" onSubmit={handleSubmit} />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form="subscription-form" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving…' : 'Create subscription'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
