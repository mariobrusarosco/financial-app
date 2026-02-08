export const BROKER_ROUTES = {
  LIST: '/brokers',
  CREATE: '/brokers',
  DELETE: (id: string) => `/brokers/${id}`,
};
