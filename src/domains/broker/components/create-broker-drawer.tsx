import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerContent, DrawerTitle } from '@ui-system/components/drawer';
import useCreateBroker from '@/domains/broker/hooks/use-create-broker';
import CreateBroker from './create-broker';

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
        <DrawerTitle>Create New Broker</DrawerTitle>
        <Button size="lg" form="broker-create-form" disabled={mutation.isPending}>
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
