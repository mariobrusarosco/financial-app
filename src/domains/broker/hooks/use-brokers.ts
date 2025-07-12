import { useQuery } from '@tanstack/react-query';
import { brokerApi } from '@/domains/broker/api';

export const GET_ALL_BROKERS_QUERY_KEY = ['brokers', 'all'];

const useBrokers = () => {
  return useQuery({
    queryKey: GET_ALL_BROKERS_QUERY_KEY,
    queryFn: brokerApi.getBrokers,
  });
};

export default useBrokers;
