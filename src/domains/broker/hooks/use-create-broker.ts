import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brokerApi } from '@/domains/broker/api';
import { useNavigate } from '@tanstack/react-router';
import { GET_ALL_BROKERS_QUERY_KEY } from '@/domains/broker/hooks/use-brokers';

const useCreateBroker = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['create-broker'],
    mutationFn: brokerApi.createBroker,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GET_ALL_BROKERS_QUERY_KEY });
      void navigate({ to: '/brokers' });
    },
  });
};

export default useCreateBroker;
