import { useIsMutating } from '@tanstack/react-query';
import { Landmark, Loader2 } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import CreateBroker from './create-broker';

export const CreateBrokerDrawer = () => {
  const isMutating = useIsMutating({ mutationKey: ['create-broker'] }) > 0;

  return (
    <DrawerLayout data-ui="create-broker-drawer">
      <DrawerLayoutHeader
        icon={Landmark}
        title="New broker"
        description="The bank or institution that holds your accounts and cards."
      />
      <DrawerLayoutBody>
        <CreateBroker />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form="broker-create-form" disabled={isMutating}>
          {isMutating && <Loader2 className="h-4 w-4 animate-spin" />}
          {isMutating ? 'Creating…' : 'Create broker'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
