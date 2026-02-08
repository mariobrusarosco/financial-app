import { http, HttpResponse } from 'msw';
import { createMockUser, createMockBroker } from '../test-data';
import { handlers as accountHandlers } from '@/domains/accounts/testing/handlers';
import { handlers as brokerHandlers } from '@/domains/broker/testing/handlers';

console.log('Global Handlers Setup:', {
  brokerHandlers,
  accountHandlers,
});

export const handlers = [
  // User handlers
  http.get('*/api/user', () => {
    return HttpResponse.json(createMockUser());
  }),

  // Import Domain Handlers
  ...brokerHandlers,
  ...accountHandlers,
];
