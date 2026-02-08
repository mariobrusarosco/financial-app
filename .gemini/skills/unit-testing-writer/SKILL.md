---
name: unit-testing-writer
description: Writes unit tests for React components, hooks, and utilities using Vitest and React Testing Library. Use when the user asks to "test this file" or "write unit tests".
---

# Unit Testing Writer

This skill specializes in writing robust, idiomatic unit tests for the Better Call Buffet project, ensuring strict adherence to the project's Vitest and React Testing Library configurations.

## Workflow

1.  **Analyze Source**: Read the source file to understand its props, hooks, and exported functions.
2.  **Identify Dependencies**: Determine which modules (API clients, hooks, stores) need to be mocked.
3.  **Check Existing**: Check if a `.test.tsx` or `.test.ts` file already exists alongside the source.
4.  **Draft Test**:
    *   **Imports**: Use `@testing/index` or `@testing/render-utils`.
    *   **Setup**: Create mock data using `@testing/test-data`.
    *   **Cases**: Write `describe` and `it` blocks for:
        *   Rendering (happy path).
        *   User interactions (clicks, inputs).
        *   Loading/Error states (if applicable).
5.  **Write File**: Create or update the test file.
6.  **Verify**: (Instruction to user) Run `yarn test` to confirm.

## Rules & Conventions

*   **Co-location**: ALWAYS place the test file in the same directory as the source file.
*   **Naming**: `[Filename].test.tsx` (for components) or `[Filename].test.ts` (for logic).
*   **Mocking**: Use `vi.mock()` for external dependencies. **Do not** mock internal UI components (like `shadcn/ui` primitives) unless they cause test environment issues; prefer shallow rendering or integration testing for them.
*   **No Snapshots**: Avoid snapshot testing unless explicitly requested. Prefer explicit assertions (`toBeInTheDocument`, `toHaveValue`).

## Reference Material

For detailed code snippets, import patterns, and the "Truth" of testing in this project, refer to the standards:

See [testing_standards.md](references/testing_standards.md).