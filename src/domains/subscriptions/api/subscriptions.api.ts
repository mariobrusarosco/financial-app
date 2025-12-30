import { apiClient } from '@/config/api';
import type {
  I_CreateSubscriptionRequest,
  I_SubscriptionResponse,
  I_SubscriptionsParams,
  I_SubscriptionsResponse,
  I_UpdateSubscriptionRequest,
} from '../types/types-and-interfaces';

export const subscriptionsApi = {
  getSubscriptions: async (params?: I_SubscriptionsParams) => {
    const response = await apiClient.get<I_SubscriptionsResponse>('/subscriptions', { params });
    return response.data;
  },

  getSubscription: async (id: string) => {
    const response = await apiClient.get<I_SubscriptionResponse>(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (data: I_CreateSubscriptionRequest) => {
    const response = await apiClient.post<I_SubscriptionResponse>('/subscriptions', data);
    return response.data;
  },

  updateSubscription: async (id: string, data: I_UpdateSubscriptionRequest) => {
    const response = await apiClient.patch<I_SubscriptionResponse>(`/subscriptions/${id}`, data);
    return response.data;
  },

  deleteSubscription: async (id: string) => {
    await apiClient.delete(`/subscriptions/${id}`);
  },

  linkPayment: async (subscriptionId: string, transactionId: string) => {
    const response = await apiClient.post<I_SubscriptionResponse>(
      `/subscriptions/${subscriptionId}/link-payment`,
      { transaction_id: transactionId }
    );
    return response.data;
  },
};
