# React Cursor Rules

These rules govern our React development practices within this project.

## Component Structure
- **Always use Function Components** - Class components are not allowed
- **Files should use kebab-case** for naming (e.g., `user-profile.tsx`, not `UserProfile.tsx`)
- **Use Named Constant exports** for components and other exports

## Project Architecture

```
domains/
  ├── domain_name/
  │     ├── components/    # UI components specific to this domain
  │     ├── hooks/         # Custom hooks specific to this domain
  │     ├── utils.ts       # Helper functions for this domain
  │     └── schema.ts      # Type definitions and data schemas
  │
  ├── another_domain/
  │     ├── components/
  │     └── ...
  │
  └── ...
```

### Guidelines for Domains

1. Each business domain should have its own directory
2. Domain-specific components should be placed in the domain's `components/` directory
3. Reusable hooks for the domain belong in the `hooks/` directory
4. Common utilities for the domain go in `utils.ts`
5. Data structures, types, and schemas go in `schema.ts`

### Cross-Domain Components

Components that are used across multiple domains should be placed in a shared components directory. 