# API Integration Approach

## Status
Accepted

## Context
Better Call Buffet needs to communicate with an external RESTful API that is maintained in a separate repository. We need a clean, maintainable, and type-safe approach to API integration that works well with TanStack Query.

## Decision
We will create a centralized API client with domain-specific service modules that follow these principles:

1. **Centralized Configuration**: All API configuration (base URL, endpoints, etc.) will be centralized
2. **Type Safety**: All API requests and responses will be fully typed using TypeScript interfaces
3. **Service-Based Organization**: API calls will be organized into service modules by domain (e.g., TransactionService, BudgetService)
4. **TanStack Query Integration**: Services will be wrapped in TanStack Query hooks for data fetching, caching, and state management
5. **Error Handling**: Consistent error handling patterns across all API calls

### Implementation Structure:
```
src/core/api/
├── config.ts           # API configuration (base URL, headers, etc.)
├── client.ts           # Base API client with common functionality
├── types.ts            # Shared API types
└── services/           # Domain-specific API services
    ├── transaction.ts  # Transaction-related API calls
    ├── budget.ts       # Budget-related API calls
    └── ...
```

### Key API Integration Patterns:
1. **Service Layer**: Each domain will have its own service module exporting functions for API operations
2. **Custom Hooks**: TanStack Query hooks will wrap service functions for data fetching and mutations
3. **Error Boundaries**: React error boundaries will handle API errors at the UI level
4. **Request Caching**: TanStack Query's caching features will be used to minimize API calls
5. **Offline Support**: Future consideration for basic offline functionality using TanStack Query's persistence

## Consequences
- Clear separation between API logic and UI components
- Consistent patterns for API integration across the application
- Type safety ensuring correctness of data shape
- Improved developer experience with autocomplete for API responses
- Some additional boilerplate for type definitions
- Potential for service modules to become overly complex if not carefully maintained 