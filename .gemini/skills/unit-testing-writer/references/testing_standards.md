# Testing Standards & Patterns

## Core Frameworks
- **Runner:** Vitest
- **Components:** React Testing Library (`@testing-library/react`)
- **Environment:** `jsdom`

## File Location & Naming
- **Location:** Co-located with the source file.
  - `src/domains/accounts/components/UserProfile.tsx` -> `src/domains/accounts/components/UserProfile.test.tsx`
- **Extensions:**
  - Components: `.test.tsx`
  - Hooks/Utils: `.test.ts`

## Imports & Setup
**Always** use the project's custom test utilities. Do not import directly from `@testing-library/react` unless strictly necessary and unavailable in the custom utils.

```typescript
// PREFERRED: Import from testing domain index or specific utils
import { render, screen, renderHook, act } from '@testing/index';
// OR
import { render, screen } from '@testing/render-utils';
import { createMockUser } from '@testing/test-data';
import { vi } from 'vitest';
```

## Mocking
Use `vi.mock` for module mocking.

```typescript
vi.mock('./api', () => ({
  fetchUserData: vi.fn(),
}));
```

## Data Generators
Use the helper functions in `@testing/test-data` instead of manual object literals whenever possible.

```typescript
const user = createMockUser({ name: 'Custom Name' });
```

## Testing Patterns

### Thick Component Tests (The Standard)
Never settle for checking `isLoading`. Assert the data.

```typescript
it('renders data from the server', async () => {
  render(<UserList />);
  
  // 1. Wait for loading to finish
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  // 2. ASSERT DATA (The 'Front' part of Frontend)
  // If MSW returns { name: 'John Doe' }, verify it:
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Hooks
Use `renderHook` and `act`.

```typescript
describe('useCounter', () => {
  it('increments', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

## Coverage Goals
- 80% statement coverage.
- Focus on happy paths and critical error states.
