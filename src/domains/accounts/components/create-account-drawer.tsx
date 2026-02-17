import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import CreateAccount from './create-account';
import { Plus } from 'lucide-react';
import { useIsMutating } from '@tanstack/react-query';

export const CreateAccountDrawer = () => {
  const isMutating = useIsMutating({ mutationKey: ['create-account'] });

  return (
    <div className="p-6 space-y-6 h-full text-primary">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create New Account"
          icon={Plus}
        />
        <Button data-testid="account-create-submit" size="lg" form="account-create-form" disabled={!!isMutating}>
          Create Account
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CreateAccount />
      </div>
    </div>
  );
};
