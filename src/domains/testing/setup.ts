import '@testing-library/jest-dom';
import { expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add custom jest-dom matchers
expect.extend(matchers);

// Automatically reset mocks between tests
beforeEach(() => {
  vi.resetAllMocks();
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Create a global fetch mock that will be used in tests
vi.stubGlobal('fetch', vi.fn());

// Set up any global mocks or test utilities here

/**
 * Define global types for test environment
 */
declare global {
  // Add any global test types here
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion {
      // Add custom assertion types here
    }
  }
}

// Export test utilities
export * from '@testing-library/react';
export { vi }; 