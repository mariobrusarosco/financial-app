import { useIsMutating } from '@tanstack/react-query';
import { Loader2, PiggyBank } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import CreateAccount from './create-account';

export const CreateAccountDrawer = () => {
  const isMutating = useIsMutating({ mutationKey: ['create-account'] }) > 0;

  return (
    <DrawerLayout data-ui="create-account-drawer">
      <DrawerLayoutHeader
        icon={PiggyBank}
        title="New account"
        description="Track the balance and transactions of a bank or broker account."
      />
      <DrawerLayoutBody>
        <CreateAccount />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button
          data-testid="account-create-submit"
          type="submit"
          form="account-create-form"
          disabled={isMutating}
        >
          {isMutating && <Loader2 className="h-4 w-4 animate-spin" />}
          {isMutating ? 'Creating…' : 'Create account'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
