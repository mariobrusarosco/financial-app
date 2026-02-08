import { http, HttpResponse } from 'msw';
import { createMockUser, createMockBroker } from '../test-data';
import { handlers as accountHandlers } from '@/domains/accounts/testing/handlers';

export const handlers = [
  // User handlers
  http.get('*/api/user', () => {
    return HttpResponse.json(createMockUser());
  }),

  // Broker handlers
  http.get('*/brokers', () => {
    return HttpResponse.json([
      createMockBroker({ id: 'b-1', name: 'Broker A' }),
      createMockBroker({ id: 'b-2', name: 'Broker B' }),
    ]);
  }),

  // Import Domain Handlers
  ...accountHandlers,
];
