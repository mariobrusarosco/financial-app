# Better Call Buffet API Layer

This directory contains the API integration layer for the Better Call Buffet application.

## Structure

```
api/
├── config.ts           # API configuration (base URL, headers, etc.)
├── client.ts           # Base API client with common functionality
├── types.ts            # Shared API types
├── query-utils.ts      # Utilities for TanStack Query integration
├── index.ts            # Unified exports
└── services/           # Domain-specific API services
    ├── transaction.ts  # Transaction-related API calls
    ├── auth.ts         # Authentication-related API calls
    ├── account.ts      # Account-related API calls
    ├── budget.ts       # Budget-related API calls
    └── investment.ts   # Investment-related API calls
```

## Usage

### Import Unified API Object

The simplest way to use the API layer is through the unified API object:

```typescript
import { api } from '@/core/api';

// Using services
api.auth.login(credentials);
api.transactions.getTransactions({ page: 1, limit: 10 });
api.accounts.getAccount(accountId);
api.budgets.getBudgetSummary();
api.investments.getPortfolioSummary();
```

### Import Specific Services

You can also import specific services directly:

```typescript
import { transactionService } from '@/core/api/services/transaction';
import { authService } from '@/core/api/services/auth';

// Using services directly
authService.login(credentials);
transactionService.getTransactions({ page: 1, limit: 10 });
```

### API Client

For custom API calls that don't have a dedicated service method:

```typescript
import { apiClient } from '@/core/api/client';

// Custom API calls
apiClient.get('/custom-endpoint');
apiClient.post('/custom-endpoint', { data: 'value' });
```

## TanStack Query Integration

This API layer is designed to work with TanStack Query. Usage examples will be provided when we implement the React Query hooks for each service.

## Error Handling

All API calls utilize the centralized error handling in the `ApiError` class. Errors from the API will be transformed into `ApiError` instances with additional context.

```typescript
import { formatApiError } from '@/core/api/query-utils';

try {
  await api.auth.login(credentials);
} catch (error) {
  // Format error for display
  const errorMessage = formatApiError(error);
  console.error(errorMessage);
}
```

## Configuration

API configuration is centralized in `config.ts`. Key configuration options include:

- `API_BASE_URL`: Base URL for all API requests
- `DEFAULT_HEADERS`: Default headers sent with all requests
- `DEFAULT_TIMEOUT`: Default timeout for requests
- `CACHE_CONFIG`: Configuration for TanStack Query caching
- `ERROR_MESSAGES`: Standard error messages 