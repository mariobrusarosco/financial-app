import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerTitle } from '@ui-system/components/drawer';
import CreateTransaction from './create-transaction';

export const CreateTransactionDrawer = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerTitle>Create New Transaction</DrawerTitle>
        <Button size="lg" form="transaction-create-form">
          Create Transaction
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateTransaction />
      </div>
    </div>
  );
};
