import { apiClient } from '@/config/api';
import { I_Broker, I_Create_BrokerForm } from '@/domains/broker/typing/types-and-interfaces';

const createBroker = async (brokerFormValues: I_Create_BrokerForm): Promise<I_Broker> => {
  const response = await apiClient.post<I_Broker>('/brokers', brokerFormValues);
  return response.data;
};

const getBrokers = async (): Promise<I_Broker[]> => {
  const response = await apiClient.get<I_Broker[]>('/brokers');
  return response.data;
};

export const brokerApi = {
  createBroker,
  getBrokers,
};
