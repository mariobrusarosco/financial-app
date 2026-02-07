import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import CreateAccount from './create-account';
import { Plus } from 'lucide-react';

export const CreateAccountDrawer = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full text-primary">
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create New Account"
          icon={Plus}
        />
        <Button data-testid="account-create-submit" size="lg" form="account-create-form">
          Create Account
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateAccount />
      </div>
    </div>
  );
};
