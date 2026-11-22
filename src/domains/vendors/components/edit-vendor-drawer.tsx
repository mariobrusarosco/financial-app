import { useNavigate } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Loader2, Store } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import { Route } from '@/routes/(auth)/route';
import { useUpdateVendor } from '../hooks';
import { vendorsApi } from '../api/vendors.api';
import { VENDORS_QUERY_KEYS } from '../api/keys';
import { VendorForm } from './vendor-form';
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
      updateVendorMutation.mutate({ id: vendorId, data: values }, { onSuccess: closeDrawer });
    }
  };

  const isSaving = updateVendorMutation.isPending;

  if (isQueryLoading && !vendor) {
    return (
      <DrawerLayout data-ui="edit-vendor-drawer">
        <DrawerLayoutHeader icon={Store} title="Edit vendor" description="Loading vendor details…" />
        <DrawerLayoutBody className="grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  if (isError || !vendor) {
    return (
      <DrawerLayout data-ui="edit-vendor-drawer">
        <DrawerLayoutHeader icon={Store} title="Edit vendor" />
        <DrawerLayoutBody>
          <p className="text-sm text-destructive">Failed to load vendor details.</p>
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  return (
    <DrawerLayout data-ui="edit-vendor-drawer">
      <DrawerLayoutHeader icon={Store} title="Edit vendor" description={vendor.name} />
      <DrawerLayoutBody>
        <VendorForm
          key={vendor.id}
          initialValues={vendor as unknown as I_Vendor}
          onSubmit={handleSubmit}
        />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form="vendor-form" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
