import { useNavigate } from '@tanstack/react-router';
import { useCreateSubscription } from '../hooks';
import { SubscriptionForm } from './subscription-form';
import { DrawerHeaderWithIcon } from '@/domains/global/components/drawer-header-with-icon';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';

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
    <div className="p-6 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <DrawerHeaderWithIcon
          title="Create Subscription"
          icon={Plus}
        />
        <div className="flex gap-2">
          <Button size="lg" form="subscription-form" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Subscription
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">
              Fill in the form to create a new subscription.
            </p>
            <SubscriptionForm
              key="create"
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
