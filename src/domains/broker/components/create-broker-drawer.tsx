import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import CreateBroker from './create-broker';
import { Plus, Loader2 } from 'lucide-react';
import { useIsMutating } from '@tanstack/react-query';

export const CreateBrokerDrawer = () => {
  const isMutating = useIsMutating({ mutationKey: ['create-broker'] });

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create New Broker"
          icon={Plus}
        />
        <Button size="lg" form="broker-create-form" disabled={!!isMutating}>
          {!!isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!!isMutating ? 'Creating...' : 'Create Broker'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CreateBroker />
      </div>
    </div>
  );
};
