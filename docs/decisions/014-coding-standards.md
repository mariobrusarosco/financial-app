# Coding Standards and Architecture Guidelines

## Domain-Based Architecture

Better Call Buffet uses a domain-based architecture to organize code into cohesive, business-focused modules. This approach promotes separation of concerns, code reusability, and makes the codebase more maintainable as it grows.

### Domain Structure

Each domain represents a distinct business capability or feature area. Domains are located in the `src/domains` directory.

```
src/
├── domains/
│   ├── global/       # Shared across all domains
│   ├── tools/        # Feature flags, analytics, etc.
│   ├── testing/      # Test utilities, mocking, etc.
│   ├── investments/  # Investment-specific features
│   └── ...           # Other business domains
```

### Domain Organization

Each domain follows a consistent internal structure:

```
domain-name/
├── api/              # API clients and service interfaces
├── components/       # UI components specific to this domain
├── hooks/            # Custom React hooks
├── screens/          # Page components
├── state-management/ # State management (context, stores, etc.)
├── utils/            # Utility functions
└── index.ts          # Public exports from this domain
```

## Specific Domains

### Global Domain

The `global` domain contains code that is shared across all other domains:

- Common UI components
- Shared hooks
- Application-wide utilities
- Global types and interfaces
- Theme definitions

**Rules for Global Domain:**

- Code in the global domain should be truly application-wide
- Avoid domain-specific logic in global components
- Keep dependencies minimal and well-documented

### Tools Domain

The `tools` domain contains infrastructure and cross-cutting tools:

- Feature flags
- Analytics
- Logging
- Monitoring
- Performance utilities

**Rules for Tools Domain:**

- Tools should be easily configurable
- Provide clear documentation for each tool
- Keep implementation details encapsulated

### Testing Domain

The `testing` domain contains test utilities and configuration, but not actual test files:

- Test utilities
- Mocking setup
- Test factories
- Test fixtures

**Rules for Testing Domain:**

- Actual test files (\*.test.ts) should be co-located with the code they test
- Testing domain should only contain shared test infrastructure

## Coding Conventions

### File Naming

- Use **kebab-case** for file naming
- Component files: `component-name.tsx`
- Utility files: `utility-name.ts`
- Hook files: `use-hook-name.ts`
- Schema files: `entity-name.schema.ts`

### UI Component Conventions

#### Icon Usage

All icons must use **Lucide React**:

```typescript
import { Calendar, Tag, CreditCard } from 'lucide-react';
```

**Naming:**

- Use descriptive icon names that match Lucide's naming
- When aliasing is needed: `import { Calendar as CalendarIcon } from 'lucide-react'`

**Size Standards:**

- Use Tailwind size utilities: `h-{size} w-{size}`
- Follow project standards: h-3/w-3 (small), h-4/w-4 (medium), h-5/w-5 (large), h-6/w-6 (extra large)
- Keep icon sizes consistent within similar contexts

**Dynamic Icons:**

- For dynamic rendering, store icons as component types, not strings
- Use `React.createElement()` or direct component reference

**Example:**

```tsx
// Static usage
import { Plus } from 'lucide-react';
<Button>
  <Plus className="h-4 w-4" />
  Add Item
</Button>;

// Dynamic usage
const items = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CreditCard, label: 'Cards' },
];
const Icon = item.icon;
<Icon className="h-5 w-5" />;
```

### Type Definitions

- Define interfaces and types in `.schema.ts` files
- Export types and interfaces with the `type` keyword
- Example: `import type { ICreateAccountForm } from "../schemas/investment-account.schema"`

### Imports/Exports

- Default exports should match the filename
- Always use named exports for utility functions and hooks
- Group imports in the following order:
  1. React and framework imports
  2. Third-party libraries
  3. Internal domains (global, tools)
  4. Current domain imports
  5. Types (using the `type` keyword)

### Component Structure

- Use functional components with hooks
- Props should be defined as interfaces in the component file or schema file
- Complex components should be broken down into smaller components

## Cross-Domain Communication

### Rules for Domain Interaction

1. Domains can import from the `global` and `tools` domains
2. Domains should not import directly from other business domains
3. For cross-domain communication, use one of these patterns:
   - Event-based communication
   - Shared state in global
   - Dedicated integration layer

### Public API

Each domain should expose a clear public API through its `index.ts` file:

```typescript
// domain/index.ts
export { ComponentA, ComponentB } from './components';
export { useFeatureX } from './hooks';
export type { FeatureData } from './schemas/feature.schema';
```

## State Management

- Use React context for domain-specific state
- Global state should be managed in the `global` domain
- Prefer composition of small contexts over a single large context

## Best Practices

1. Keep domains focused on specific business capabilities
2. Minimize dependencies between domains
3. Write domain-specific tests for each domain
4. Document public APIs of each domain
5. Follow the Single Responsibility Principle for files and components
