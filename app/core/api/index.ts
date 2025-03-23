// Export configuration
export * from './config';

// Export client
export * from './client';

// Export types
export * from './types';

// Export services
export * from './services/transaction';

// Export a unified API object
import { apiClient } from './client';
import { transactionService } from './services/transaction';

/**
 * Unified API object for easy importing
 */
export const api = {
  client: apiClient,
  transactions: transactionService,
  // Add other services here as they are implemented
}; 