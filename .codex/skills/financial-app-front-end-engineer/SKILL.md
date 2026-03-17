---
name: financial-app-front-end-engineer
description: Build or update frontend UI for the financial-app project in React and TypeScript. Use when Codex needs to create or modify project-specific frontend components, screens, hooks, routes, styling, or related UI behavior in this repository, especially when the work must follow this repo's style guide and code taste rather than generic frontend conventions.
---

# Financial App Front End Engineer

Read the relevant project style-guide files before editing code. Prioritize this repository's code taste over generic minimal changes whenever the user asks for style-guide compliance, consistency, or refactoring.

## Workflow

1. Read the most relevant guidance before editing:
   - `docs/style-guide/components-lifecycle.md` for component and UI-hook responsibilities
   - `docs/style-guide/tanstack-query.md` for data-fetching patterns
   - `docs/decisions/014-coding-standards.md` and `AGENTS.md` for repo conventions
2. Inspect the target file and its direct consumers before changing the implementation.
3. Match the surrounding domain structure in `src/domains/<domain>/`.
4. Prefer the smallest change that fully satisfies the style guide, even if that means updating consumers.

## Hook And Component Rules

- Treat style-guide compliance as a behavioral and architectural requirement, not as cosmetic cleanup.
- When a component consumes fetched or derived data, move UI shaping into a domain hook instead of leaving raw query adaptation in the `.tsx` file.
- Prefer UI-oriented hooks that return exactly:
  - `data`
  - `states`
  - `handlers`
- Keep low-level data hooks small when they are only thin wrappers around API/query concerns.
- If a low-level query hook is still useful, prefer keeping the main solution in the user-targeted file. Only introduce a separate UI-oriented hook if the user explicitly asks for it or the change cannot be completed cleanly within the existing file.
- When refactoring for style-guide compliance, update the affected consumer components too when needed. Do not stop at the hook if the component still violates the style guide.
- Do not leave sorting, filtering, pagination shaping, derived booleans, or query-state naming inside components when the style guide indicates that composition belongs in the hook.

## Implementation Rules

- Use absolute imports with the repo path aliases.
- Keep files in the correct domain folder and preserve the domain-based architecture.
- Use `kebab-case` filenames.
- Use named exports for hooks and utilities.
- Keep comments sparse and only when they add non-obvious context.

## Scope Discipline

- Do not introduce new abstractions, helper types, helper hooks, files, or utilities unless the user explicitly asks for them or they are strictly required to complete the requested change.
- Do not add implementation patterns based on personal preference alone. If a pattern is not required by the repo style guide or the user request, do not introduce it.
- When the user points to a specific file, keep the main solution in that file unless the user explicitly approves moving the main responsibility elsewhere.
- Prefer adapting existing code over inventing new structure.
- If you believe a new file, helper, interface, or abstraction would improve the code, pause and ask before adding it.

## Decision Rule

- If the task is to "make it compliant with the style guide" or "follow code taste", prefer the repo's preferred abstraction over the narrowest possible edit.
- If two interpretations are plausible, choose the one that better aligns with the style-guide documents and the consuming component's responsibilities.
- If a change would require a broader architectural move beyond the local feature scope, pause and ask before proceeding.
- Apply the style guide within the requested scope; do not create additional layers just to better match an ideal architecture.
- Do not optimize for "cleaner architecture" beyond the user's request.
- Do not create "better" structure unless the current task explicitly asks for refactoring at that level.
- If a change can be completed by modifying existing files, prefer that over creating new files.
- Treat unrequested abstractions as scope expansion.
