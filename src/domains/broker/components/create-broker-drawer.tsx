import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import useCreateBroker from '@/domains/broker/hooks/use-create-broker';
import CreateBroker from './create-broker';
import { Plus, Loader2 } from 'lucide-react';

export const CreateBrokerDrawer = () => {
  const navigate = useNavigate();
  const mutation = useCreateBroker();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create New Broker"
          icon={Plus}
        />
        <Button size="lg" form="broker-create-form" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mutation.isPending ? 'Creating...' : 'Create Broker'}
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateBroker />
      </div>
    </div>
  );
};
