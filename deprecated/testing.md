# Testing Guide

This guide covers our testing approach for the Better Call Buffet project.

## Overview

We use Vitest as our testing framework along with React Testing Library for component testing. This combination provides:

- Fast test execution with native ESM support
- Strong integration with our Vite-based build system
- A user-centric approach to testing components
- Excellent TypeScript support

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode (for development)
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run tests with UI interface
yarn test:ui
```

## Test Structure

Tests are organized following our domain-based architecture:

```
src/domains/
├── domain-name/
│   ├── components/
│   │   ├── component-name.tsx
│   │   └── component-name.test.tsx  # Component tests
│   ├── hooks/
│   │   ├── use-feature.ts
│   │   └── use-feature.test.ts      # Hook tests
│   └── utils/
│       ├── utility.ts
│       └── utility.test.ts          # Utility tests
```

## Test Utilities

We have a dedicated `testing` domain with various utilities:

```
src/domains/testing/
├── setup.ts          # Global test setup
├── render-utils.tsx  # Custom render function with providers
├── test-data.ts      # Mock data generators
└── index.ts          # Public exports
```

Import testing utilities from the testing domain:

```typescript
// Import from testing domain index
import { render, createMockUser } from '@testing/index';

// Or import specific utilities directly
import { render } from '@testing/render-utils';
import { createMockUser } from '@testing/test-data';
```

## Writing Tests

### Component Tests

Use React Testing Library to test components from a user perspective:

```typescript
import { render, screen } from '@testing/render-utils';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('displays user information', () => {
    render(<UserProfile name="John Doe" email="john@example.com" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### Hook Tests

Test custom hooks with React Testing Library's `renderHook`:

```typescript
import { renderHook, act } from '@testing/index';
import { useCounter } from './use-counter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Utility Tests

Test utility functions directly:

```typescript
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });
});
```

## Mocking

Vitest provides powerful mocking capabilities:

```typescript
import { vi } from 'vitest';
import { fetchUserData } from './api';
import { UserProfile } from './user-profile';

// Mock module
vi.mock('./api', () => ({
  fetchUserData: vi.fn(),
}));

describe('UserProfile', () => {
  it('loads user data', async () => {
    // Setup mock implementation
    fetchUserData.mockResolvedValue({ name: 'John', email: 'john@example.com' });

    // Test component
    // ...
  });
});
```

## Testing Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it's built
2. **Use mock data generators** - Create consistent test data with `createMockUser()` etc.
3. **Test accessibility** - Use Testing Library's `toHaveAccessibleName()` and similar matchers
4. **Organize tests by domain** - Keep tests close to the code they're testing
5. **Test edge cases** - Empty states, loading states, error handling
6. **Keep tests independent** - Each test should be self-contained
7. **Use meaningful assertions** - Assertions should express intent clearly

## Coverage Requirements

We aim for:

- 80% statement coverage overall
- 100% coverage for critical utility functions
- Test all public API surfaces of components and hooks

## Debugging Tests

When tests fail:

1. Use `screen.debug()` to output the current DOM
2. Run tests with `--ui` flag for the interactive UI
3. Set breakpoints in your IDE
4. Check test console output for detailed failure messages

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
