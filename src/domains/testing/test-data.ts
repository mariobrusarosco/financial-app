/**
 * Test data generators for testing purposes
 */

/**
 * Create mock user data
 */
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  ...overrides,
});

/**
 * Create mock broker data
 */
export const createMockBroker = (overrides = {}) => ({
  id: 'broker-123',
  name: 'Default Broker',
  colors: ['#007bff', '#6c757d'],
  ...overrides,
});

/**
 * Create mock account data
 */
export const createMockAccount = (overrides = {}) => ({
  id: 'account-123',
  name: 'Main Account',
  balance: 5000,
  currency: 'USD',
  type: 'cash',
  broker: createMockBroker(),
  ...overrides,
});

/**
 * Create mock transaction data
 */
export const createMockTransaction = (overrides = {}) => ({
  id: 'transaction-123',
  accountId: 'account-123',
  amount: 100,
  currency: 'USD',
  description: 'Grocery shopping',
  date: new Date('2023-01-01'),
  category: 'food',
  type: 'expense',
  ...overrides,
});

/**
 * Create an array of mock transactions
 */
export const createMockTransactions = (count = 3, baseOverrides = {}) =>
  Array.from({ length: count }, (_, index) =>
    createMockTransaction({
      id: `transaction-${index + 1}`,
      amount: 100 * (index + 1),
      ...baseOverrides,
    })
  );

/**
 * Create mock investment data
 */
export const createMockInvestment = (overrides = {}) => ({
  id: 'investment-123',
  name: 'Stock Portfolio',
  value: 10000,
  currency: 'USD',
  type: 'stocks',
  returnRate: 7.5,
  ...overrides,
});

/**
 * Helper to generate random amounts for testing
 */
export const randomAmount = (min = 10, max = 1000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
