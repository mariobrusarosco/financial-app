import { createMockBroker } from '@/domains/testing/test-data';
import { mockBrokersList } from './index';

// Define the default brokers for the happy path
export const defaultBrokers = [
  createMockBroker({ id: 'b-1', name: 'Broker A', colors: ['#FF0000'] }),
  createMockBroker({ id: 'b-2', name: 'Broker B', colors: ['#00FF00'] }),
  createMockBroker({ id: 'b-3', name: 'Broker C', colors: ['#0000FF'] }),
];

export const handlers = [
  // Brokers List (using our factory)
  mockBrokersList(defaultBrokers),
];
