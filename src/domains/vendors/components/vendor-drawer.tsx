import { Route } from '@/routes/(auth)/route';
import { useVendor, useCreateVendor, useUpdateVendor } from '../hooks';
import { VendorForm } from './vendor-form';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/domains/ui-system/components/drawer';
import { Loader2 } from 'lucide-react';

const VendorDrawerContent = () => {
  const { vendorId } = Route.useSearch();
  const isEditMode = !!vendorId;

  // Hooks for fetching data in edit mode and for mutations
  const vendorQuery = useVendor(vendorId!);
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();

  if (isEditMode && vendorQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEditMode && vendorQuery.isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Failed to load vendor details.</p>
      </div>
    );
  }

  const initialValues = isEditMode ? vendorQuery.data?.data : undefined;
  const isLoading = createVendorMutation.isPending || updateVendorMutation.isPending;

  const handleSubmit = (values: any) => {
    if (isEditMode) {
      updateVendorMutation.mutate({ id: vendorId!, data: values });
    } else {
      createVendorMutation.mutate(values);
    }
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{isEditMode ? 'Edit Vendor' : 'Create New Vendor'}</DrawerTitle>
        <DrawerDescription>
          {isEditMode
            ? `Editing the details for vendor: ${initialValues?.name}`
            : 'Add a new vendor to your list of payees.'}
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <VendorForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
};

export const VendorDrawer = () => {
  return <VendorDrawerContent />;
};
