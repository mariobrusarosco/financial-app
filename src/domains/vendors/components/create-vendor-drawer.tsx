import { useNavigate } from '@tanstack/react-router';
import { Loader2, Store } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import { useCreateVendor } from '../hooks';
import { VendorForm } from './vendor-form';

export const CreateVendorDrawer = () => {
  const navigate = useNavigate();
  const createVendorMutation = useCreateVendor();

  const closeDrawer = () => {
    navigate({ search: (prev: any) => ({ ...prev, drawer: undefined, vendorId: undefined }) });
  };

  const handleSubmit = (values: any) => {
    createVendorMutation.mutate(values, { onSuccess: closeDrawer });
  };

  const isLoading = createVendorMutation.isPending;

  return (
    <DrawerLayout data-ui="create-vendor-drawer">
      <DrawerLayoutHeader
        icon={Store}
        title="New vendor"
        description="Add a store or payee to recognize recurring activity."
      />
      <DrawerLayoutBody>
        <VendorForm onSubmit={handleSubmit} />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form="vendor-form" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating…' : 'Create vendor'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
