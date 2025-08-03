import { apiClient } from '@/config/api';
import { I_Broker, I_Create_BrokerForm } from '@/domains/broker/type/types-and-interfaces';

const createBroker = async (brokerFormValues: I_Create_BrokerForm): Promise<I_Broker> => {
  const response = await apiClient.post<I_Broker>('/brokers/', brokerFormValues);
  return response.data;
};

const getBrokers = async (): Promise<I_Broker[]> => {
  const response = await apiClient.get<I_Broker[]>('/brokers/');
  return response.data;
};

const deleteBroker = async (brokerId: string): Promise<void> => {
  await apiClient.delete(`/brokers/${brokerId}/`);
};

export const brokerApi = {
  createBroker,
  getBrokers,
  deleteBroker,
};
