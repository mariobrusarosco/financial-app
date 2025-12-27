import { apiClient } from '@/config/api';
import type {
  I_CreateVendorRequest,
  I_UpdateVendorRequest,
  I_VendorResponse,
  I_VendorsParams,
  I_VendorsResponse,
} from '../types/types-and-interfaces';

export const vendorsApi = {
  getVendors: async (params?: I_VendorsParams) => {
    const response = await apiClient.get<I_VendorsResponse>('/vendors', { params });
    return response.data;
  },

  getVendor: async (id: string) => {
    const response = await apiClient.get<I_VendorResponse>(`/vendors/${id}`);
    return response.data;
  },

  createVendor: async (data: I_CreateVendorRequest) => {
    const response = await apiClient.post<I_VendorResponse>('/vendors', data);
    return response.data;
  },

  updateVendor: async (id: string, data: I_UpdateVendorRequest) => {
    const response = await apiClient.patch<I_VendorResponse>(`/vendors/${id}`, data);
    return response.data;
  },

  deleteVendor: async (id: string) => {
    await apiClient.delete(`/vendors/${id}`);
  },
};
