import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brokerApi } from '@/domains/broker/api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { GET_ALL_BROKERS_QUERY_KEY } from './use-brokers';
import { BrokerErrorMessages } from '@/domains/broker/api/error-messages';
import { toast } from 'sonner';

export const useDeleteBroker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brokerApi.deleteBroker,
    onSuccess: () => {
      toast.success('Broker deleted successfully!', {
        description: 'The broker has been removed from your account',
        duration: 4000,
      });

      void queryClient.invalidateQueries({
        queryKey: GET_ALL_BROKERS_QUERY_KEY,
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: BrokerErrorMessages.BROKER_DELETION_FAILED,
      });
    },
  });
};
