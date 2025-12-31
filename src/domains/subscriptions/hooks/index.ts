import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptions.api';
import { SUBSCRIPTIONS_QUERY_KEYS } from '../api/keys';
import type { I_CreateSubscriptionRequest, I_UpdateSubscriptionRequest, I_SubscriptionsParams } from '../types/types-and-interfaces';
import { toast } from 'sonner';

export const useSubscriptions = (params?: I_SubscriptionsParams) => {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.list(params),
    queryFn: () => subscriptionsApi.getSubscriptions(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(id),
    queryFn: () => subscriptionsApi.getSubscription(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: I_CreateSubscriptionRequest) => subscriptionsApi.createSubscription(data),
    onSuccess: () => {
      toast.success('Subscription created successfully!');
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.error('Failed to create subscription.', { description: error.message });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: I_UpdateSubscriptionRequest }) =>
      subscriptionsApi.updateSubscription(id, data),
    onSuccess: () => {
      toast.success('Subscription updated successfully!');
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.details() });
    },
    onError: (error) => {
      toast.error('Failed to update subscription.', { description: error.message });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscription(id),
    onSuccess: () => {
      toast.success('Subscription deleted successfully!');
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.error('Failed to delete subscription.', { description: error.message });
    },
  });
};

export const useLinkPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, transactionId }: { subscriptionId: string; transactionId: string }) =>
      subscriptionsApi.linkPayment(subscriptionId, transactionId),
    onSuccess: () => {
      toast.success('Payment linked successfully!');
      // Invalidate subscription related queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.all });
      // Invalidate transaction related queries since they might have updated subscription info
      queryClient.invalidateQueries({ queryKey: ['all-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['account-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['account-transactions-paginated'] });
    },
    onError: (error: any) => {
      toast.error('Failed to link payment.', { description: error.message });
    },
  });
};
