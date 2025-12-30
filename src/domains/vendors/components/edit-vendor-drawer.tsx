import { useNavigate } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Route } from '@/routes/(auth)/route';
import { useUpdateVendor } from '../hooks';
import { vendorsApi } from '../api/vendors.api';
import { VENDORS_QUERY_KEYS } from '../api/keys';
import { VendorForm } from './vendor-form';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/domains/ui-system/components/drawer';
import { Loader2 } from 'lucide-react';
import type { I_Vendor } from '../types/types-and-interfaces';

export const EditVendorDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { vendorId } = Route.useSearch();

  // 1. Transaction Pattern: Try to find the vendor in the list cache first
  const cachedVendorsData = queryClient.getQueriesData<{
    data: I_Vendor[];
  }>({
    queryKey: VENDORS_QUERY_KEYS.lists(),
  });

  const cachedVendor = cachedVendorsData
    .flatMap(([, data]) => data?.data ?? [])
    .find(vendor => vendor.id === vendorId);

  // 2. Fetch data if not in cache, using cached item as initialData
  const {
    data: vendor,
    isLoading: isQueryLoading,
    isError,
  } = useQuery({
    queryKey: VENDORS_QUERY_KEYS.detail(vendorId!),
    queryFn: () => vendorsApi.getVendor(vendorId!),
    enabled: !!vendorId,
    initialData: cachedVendor as any,
  });

  const updateVendorMutation = useUpdateVendor();

  const closeDrawer = () => {
    navigate({ search: (prev: any) => ({ ...prev, drawer: undefined, vendorId: undefined }) });
  };

  const handleSubmit = (values: any) => {
    if (vendorId) {
      updateVendorMutation.mutate(
        { id: vendorId, data: values },
        { onSuccess: closeDrawer }
      );
    }
  };

  const isLoading = updateVendorMutation.isPending || isQueryLoading;

  if (isQueryLoading && !vendor) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-destructive">Failed to load vendor details.</p>
      </div>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Edit Vendor</DrawerTitle>
        <DrawerDescription>
          Editing the details for vendor: {vendor.name}
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <VendorForm
          key={vendor.id}
          initialValues={vendor as unknown as I_Vendor}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={true}
        />
      </div>
    </>
  );
};
