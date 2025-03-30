// Export configuration
export * from './config';

// Export client
export * from './client';

// Export types
export * from './types';

// Export query utilities
export * from './query-utils';

// Export services
export * from './services/transaction';
export * from './services/auth';
export * from './services/account';
export * from './services/budget';
export * from './services/investment';
export * from './services/openai';

// Export a unified API object
import { apiClient } from './client';
import { transactionService } from './services/transaction';
import { authService } from './services/auth';
import { accountService } from './services/account';
import { budgetService } from './services/budget';
import { investmentService } from './services/investment';
import { openaiService } from './services/openai';

/**
 * Unified API object for easy importing
 */
export const api = {
  client: apiClient,
  transactions: transactionService,
  auth: authService,
  accounts: accountService,
  budgets: budgetService,
  investments: investmentService,
  openai: openaiService,
  // Add other services here as they are implemented
}; 