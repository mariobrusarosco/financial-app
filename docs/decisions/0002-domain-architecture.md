# Domain-Based Architecture

## Status
Accepted

## Context
We need a consistent project architecture that organizes code by business domains rather than technical concerns. This will help maintain separation of concerns while grouping related functionality together.

## Decision
We will adopt a domain-based architecture where each business domain contains its own components, hooks, screens, and other related code. We'll use the term "domain" instead of "features" to better reflect the business-oriented nature of this organization.

### Domain Structure
Each domain will follow this consistent structure:

```
domain/               # e.g., dashboard, budget, expenses
├── api/              # Domain-specific API calls
├── components/       # UI components specific to this domain
├── context/          # React context providers for domain state
├── hooks/            # Custom hooks for domain logic
├── screens/          # Full page components
├── schema/           # TypeScript types, interfaces, and validation schemas
└── utils/            # Domain-specific utility functions
```

### Shared Code
Code that is used across multiple domains will be placed in a central `core` directory:

```
core/
├── api/              # API client and shared API utilities
├── components/       # Shared UI components
├── context/          # Application-wide context providers
├── hooks/            # Shared custom hooks
├── utils/            # Shared utility functions
└── types/            # Common TypeScript types
```

### Routes
Routes will be defined in a separate directory, mapping to the screens in each domain:

```
routes/
└── index.tsx         # Route definitions using TanStack Router
```

## Consequences
- Clear separation between different business domains
- Self-contained domains with all necessary code
- Reduced coupling between unrelated parts of the application
- Easier navigation for developers working on specific features
- Consistent structure makes it easier to understand the codebase
- More maintainable as the application grows
- May result in some duplication across domains, which is an acceptable trade-off for the benefits of separation 