import { useNavigate } from '@tanstack/react-router';
import { useCreateVendor } from '../hooks';
import { VendorForm } from './vendor-form';
import { Loader2, Plus } from 'lucide-react';
import { DrawerHeader } from '@/domains/global/components/drawer-header';

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
      <DrawerHeader
        title="Create New Vendor"
        description="Add a new vendor to your list of payees."
        icon={Plus}
      />
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
