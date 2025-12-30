import { useNavigate } from '@tanstack/react-router';
import { useCreateVendor } from '../hooks';
import { VendorForm } from './vendor-form';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/domains/ui-system/components/drawer';
import { Loader2 } from 'lucide-react';

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
    <>
      <DrawerHeader>
        <DrawerTitle>Create New Vendor</DrawerTitle>
        <DrawerDescription>Add a new vendor to your list of payees.</DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <VendorForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={false}
        />
      </div>
    </>
  );
};
