import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brokerApi } from '@/domains/broker/api';
import { useNavigate } from '@tanstack/react-router';
import { GET_ALL_BROKERS_QUERY_KEY } from '@/domains/broker/hooks/use-brokers';

const useCreateBroker = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: brokerApi.createBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_ALL_BROKERS_QUERY_KEY });
      navigate({ to: '/brokers' });
    },
  });
};

export default useCreateBroker;
