import { apiClient } from '@/config/api';
import type {
  I_CreateInstallmentPlanRequest,
  I_InstallmentPlanResponse,
  I_InstallmentPlanListResponse,
  I_InstallmentPlansParams,
  I_LinkInstallmentRequest,
  I_InstallmentPlan,
  I_InstallmentPlanUpdatePayload,
} from '../types/types-and-interfaces';

export const installmentsApi = {
  getPlans: async (params?: I_InstallmentPlansParams) => {
    const response = await apiClient.get<I_InstallmentPlanListResponse>('/installments/plans', {
      params,
    });
    return response.data;
  },

  getPlan: async (id: string | undefined) => {
    const response = await apiClient.get<I_InstallmentPlan>(`/installments/plans/${id}`);
    return response.data;
  },

  createPlan: async (data: I_CreateInstallmentPlanRequest) => {
    const response = await apiClient.post<I_InstallmentPlanResponse>('/installments/plans', data);
    return response.data;
  },

  // Send only the fields that changed; the API returns the updated plan
  updatePlan: async (id: string, data: I_InstallmentPlanUpdatePayload) => {
    const response = await apiClient.patch<I_InstallmentPlan>(`/installments/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: string) => {
    await apiClient.delete(`/installments/plans/${id}`);
  },

  linkTransaction: async (installmentId: string, data: I_LinkInstallmentRequest) => {
    const response = await apiClient.post<I_InstallmentPlanResponse>(
      `/installments/${installmentId}/link-transaction`,
      data
    );
    return response.data;
  },
};
