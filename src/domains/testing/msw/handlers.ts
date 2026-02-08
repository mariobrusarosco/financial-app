import { http, HttpResponse } from 'msw';
import { createMockUser } from '../test-data';

export const handlers = [
  // Example handler - replace with real domain handlers as we build them
  http.get('*/api/user', () => {
    return HttpResponse.json(createMockUser());
  }),
];
