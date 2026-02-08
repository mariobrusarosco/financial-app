# ADR: Testing Framework - Vitest

## Status

Accepted

## Date

2023-11-15

## Context

For the Better Call Buffet project, we need a comprehensive testing framework that aligns with our technology stack, provides good developer experience, and allows us to test React components, hooks, and utility functions efficiently. The application is built with TanStack Start, which uses Vite as its bundler.

## Decision

We will use Vitest as our primary testing framework, along with React Testing Library for component testing.

## Rationale

### Pros:

1. **Vite Integration**: Vitest is built on top of Vite, the same bundler used by our project, ensuring seamless integration
2. **Performance**: Significantly faster than Jest, especially for large test suites
3. **ESM Support**: Native support for ES modules, which aligns with our project structure
4. **TypeScript Support**: First-class TypeScript support without additional configuration
5. **API Compatibility**: API compatible with Jest, making migration and learning curve minimal
6. **Watch Mode**: Efficient watch mode that only retests affected files
7. **UI Mode**: Interactive UI for running and debugging tests
8. **React Testing Library Integration**: Works well with React Testing Library for component testing

### Cons:

1. **Maturity**: Newer than Jest, potentially with fewer resources and less community support
2. **Ecosystem**: Smaller ecosystem of plugins and extensions
3. **Documentation**: Less extensive documentation compared to Jest
4. **Edge Cases**: Might have less coverage for edge cases that Jest has handled over years

### Refined Strategy (2025 Update)

We have further refined our testing strategy to distinctly categorize tests:

1.  **Component Tests (The Standard):**
    *   **Scope:** UI components, pages, layouts.
    *   **Mocking:** **Mandatory MSW usage** for all network requests. We explicitly avoid mocking `fetch`, `axios`, or `react-query` hooks directly to ensure tests rely on behavior, not implementation.
2.  **Unit Tests (The Logic):**
    *   **Scope:** Utilities, helpers, complex pure-logic hooks.
    *   **Mocking:** `vi.mock()` is permitted for non-network dependencies.

## Configuration Details

### Vitest Configuration

- Test files matching: `**/*.test.ts`, `**/*.test.tsx`
- Environment: jsdom for simulating browser environment
- Coverage reporting enabled
- Integration with TypeScript path aliases
- **MSW Integration:** configured in setup files to intercept requests during component tests.

### React Testing Library

- Used for component testing
- User-centric testing approach
- Accessibility testing capabilities

## Alternatives Considered

### Jest:

- Industry standard with wide adoption
- Extensive ecosystem of plugins and extensions
- More mature with better handling of edge cases
- Slower execution, especially with TypeScript
- Requires additional configuration for Vite/ESM projects

### Testing Library + Jest:

- Comprehensive solution
- Well-documented
- Larger overhead
- Slower than Vitest
- Configuration challenges with Vite

### Cypress for Component Testing:

- Visual testing capabilities
- Good for end-to-end testing
- Heavier setup
- Overkill for unit testing
- Better suited for E2E tests which we'll address separately

## Consequences

- Faster test execution in development
- Seamless integration with our Vite-based build system
- Learning curve for developers more familiar with Jest (though mitigated by API compatibility)
- Potential need to create custom solutions for scenarios where Vitest plugins don't exist yet
- Better developer experience with faster feedback loops

## Implementation Notes

- Vitest configuration in `vitest.config.ts`
- React Testing Library setup for component testing
- Test utilities in the testing domain
- Integration with ESLint for test linting
- CI/CD integration for continuous testing
- Consider adding UI mode for interactive test debugging
