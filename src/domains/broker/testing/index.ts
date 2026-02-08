import { http, HttpResponse } from 'msw';

// Minimal implementation for debugging
export const mockBrokersList = (response: any) => {
  return http.get(/\/brokers/, async () => {
    return HttpResponse.json(response);
  });
};
