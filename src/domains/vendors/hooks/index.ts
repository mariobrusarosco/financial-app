import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '../api/vendors.api';
import { VENDORS_QUERY_KEYS } from '../api/keys';
import type { I_CreateVendorRequest, I_UpdateVendorRequest, I_VendorsParams } from '../types/types-and-interfaces';
import { toast } from 'sonner';

export const useVendors = (params?: I_VendorsParams) => {
  return useQuery({
    queryKey: VENDORS_QUERY_KEYS.list(params),
    queryFn: () => vendorsApi.getVendors(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: VENDORS_QUERY_KEYS.detail(id),
    queryFn: () => vendorsApi.getVendor(id),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: I_CreateVendorRequest) => vendorsApi.createVendor(data),
    onSuccess: () => {
      toast.success('Vendor created successfully!');
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.error('Failed to create vendor.', { description: error.message });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: I_UpdateVendorRequest }) =>
      vendorsApi.updateVendor(id, data),
    onSuccess: () => {
      toast.success('Vendor updated successfully!');
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEYS.details() });
    },
    onError: (error) => {
      toast.error('Failed to update vendor.', { description: error.message });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsApi.deleteVendor(id),
    onSuccess: () => {
      toast.success('Vendor deleted successfully!');
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.error('Failed to delete vendor.', { description: error.message });
    },
  });
};
