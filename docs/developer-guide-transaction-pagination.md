# Transaction Pagination Features - Developer Guide

This guide provides comprehensive documentation for implementing and using transaction pagination features in the financial application.

## 📋 Overview

The transaction pagination system provides advanced filtering, searching, sorting, and pagination capabilities for transaction lists across the application. It's currently implemented for credit card transactions and can be extended to other transaction types.

## 🔧 API Parameters

### 1. Pagination Parameters

| Parameter  | Type     | Default | Range   | Description         |
| ---------- | -------- | ------- | ------- | ------------------- |
| `page`     | `number` | `1`     | `≥ 1`   | Current page number |
| `per_page` | `number` | `20`    | `1-100` | Items per page      |

### 2. Advanced Filtering

#### Date Range

- `date_from` (string, ISO date): Start date filter
- `date_to` (string, ISO date): End date filter

#### Amount Range

- `amount_min` (number): Minimum transaction amount
- `amount_max` (number): Maximum transaction amount

#### Text Search

- `description_contains` (string): Search within transaction descriptions
- `category` (string): Filter by specific category

#### Status Filtering

- `is_paid` (boolean): Filter by payment status
- `movement_type` (enum): Filter by transaction type
  - `income` - Money coming in
  - `expense` - Money going out
  - `investment` - Investment-related transactions
  - `transfer` - Money transfers

### 3. Sorting Options

| Parameter    | Type     | Options                                    | Description      |
| ------------ | -------- | ------------------------------------------ | ---------------- |
| `sort_by`    | `string` | `date`, `amount`, `created_at`, `category` | Field to sort by |
| `sort_order` | `string` | `desc`, `asc`                              | Sort direction   |

## 📊 Response Format

```typescript
interface TransactionPaginationResponse {
  data: Transaction[]; // Array of transaction objects
  meta: {
    total: number; // Total number of transactions
    page: number; // Current page number
    per_page: number; // Items per page
    has_next: boolean; // Whether there's a next page
    has_previous: boolean; // Whether there's a previous page
  };
}
```

## 🚀 Usage Examples

### Basic Pagination

```http
GET /api/v1/credit_cards/{id}/transactions?page=2&per_page=50
```

### With Date Range Filtering

```http
GET /api/v1/credit_cards/{id}/transactions?date_from=2025-01-01&date_to=2025-01-31&page=1
```

### With Amount Range and Search

```http
GET /api/v1/credit_cards/{id}/transactions?amount_min=100&description_contains=PIX&page=1
```

### With Sorting and Status Filter

```http
GET /api/v1/credit_cards/{id}/transactions?sort_by=amount&sort_order=desc&is_paid=true
```

### Complex Query Example

```http
GET /api/v1/credit_cards/{id}/transactions?date_from=2025-01-01&amount_min=50&description_contains=restaurant&movement_type=expense&sort_by=date&sort_order=desc&page=1&per_page=25
```

## 💻 Frontend Implementation

### 1. TanStack Query Integration

The implementation leverages TanStack Query's built-in pagination features for optimal user experience:

#### Traditional Pagination with `keepPreviousData`

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useCreditCardTransactions = (
  creditCardId: string,
  params?: TransactionPaginationParams
) => {
  return useQuery({
    queryKey: ['credit-card-transactions', creditCardId, params],
    queryFn: () => creditCardApi.getCreditCardTransactions(creditCardId, params),
    enabled: !!creditCardId,
    placeholderData: keepPreviousData, // Prevents UI flickering
    staleTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
};
```

#### Infinite Queries for Load More/Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export const useCreditCardTransactionsInfinite = (
  creditCardId: string,
  baseParams?: Omit<TransactionPaginationParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: ['credit-card-transactions-infinite', creditCardId, baseParams],
    queryFn: ({ pageParam = 1 }) =>
      creditCardApi.getCreditCardTransactions(creditCardId, {
        ...baseParams,
        page: pageParam,
      }),
    enabled: !!creditCardId,
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.meta.has_next ? lastPage.meta.page + 1 : undefined),
    getPreviousPageParam: firstPage =>
      firstPage.meta.has_previous ? firstPage.meta.page - 1 : undefined,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
```

### 2. TanStack Query Benefits

| Feature             | Benefit                                  | Implementation                            |
| ------------------- | ---------------------------------------- | ----------------------------------------- |
| `keepPreviousData`  | Prevents UI flickering during pagination | Shows previous data while fetching new    |
| `isPlaceholderData` | Visual feedback for loading states       | Dims content and shows loading indicators |
| `staleTime`         | Reduces unnecessary API calls            | Caches data for 30 seconds                |
| `initialPageParam`  | Clean infinite query setup               | Starts from page 1                        |
| `getNextPageParam`  | Automatic page management                | Uses API meta to determine next page      |

### 3. Type Definitions

```typescript
interface TransactionPaginationParams {
  // Pagination
  page?: number;
  per_page?: number;

  // Date filtering
  date_from?: string;
  date_to?: string;

  // Amount filtering
  amount_min?: number;
  amount_max?: number;

  // Text search
  description_contains?: string;
  category?: string;

  // Status filtering
  is_paid?: boolean;
  movement_type?: 'income' | 'expense' | 'investment' | 'transfer';

  // Sorting
  sort_by?: 'date' | 'amount' | 'created_at' | 'category';
  sort_order?: 'asc' | 'desc';
}
```

### 4. React Hook Usage with TanStack Query States

```typescript
import { useState } from 'react';
import { useCreditCardTransactions } from '@/domains/credit-cards/hooks/use-credit-card-transactions';

const MyComponent = ({ creditCardId }: { creditCardId: string }) => {
  const [params, setParams] = useState<TransactionPaginationParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const {
    data: response,
    isLoading,
    isError,
    isPlaceholderData, // TanStack Query state for keepPreviousData
    isPreviousData, // Legacy property, use isPlaceholderData instead
  } = useCreditCardTransactions(creditCardId, params);

  const transactions = response?.data || [];
  const meta = response?.meta;

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilters: Partial<TransactionPaginationParams>) => {
    setParams(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Show loading only on initial load, not when using placeholder data
  if (isLoading && !isPlaceholderData) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className={isPlaceholderData ? 'opacity-50' : ''}>
        Transactions {isPlaceholderData && <LoadingIcon />}
      </h2>

      {/* Dim content while loading new data */}
      <div className={isPlaceholderData ? 'opacity-50 transition-opacity' : ''}>
        {transactions.map(transaction => (
          <TransactionCard key={transaction.id} {...transaction} />
        ))}
      </div>

      <Pagination
        currentPage={meta.page}
        hasNext={meta.has_next && !isPlaceholderData} // Disable while loading
        hasPrevious={meta.has_previous && !isPlaceholderData}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
```

### 5. API Client Implementation

```typescript
// API function
getCreditCardTransactions: async (
  creditCardId: string,
  params?: TransactionPaginationParams
): Promise<TransactionPaginationResponse> => {
  const response = await apiClient.get<TransactionPaginationResponse>(
    `/credit_cards/${creditCardId}/transactions`,
    { params }
  );
  return response.data;
};

// React Query hook
export const useCreditCardTransactions = (
  creditCardId: string,
  params?: TransactionPaginationParams
) => {
  return useQuery({
    queryKey: ['credit-card-transactions', creditCardId, params],
    queryFn: () => creditCardApi.getCreditCardTransactions(creditCardId, params),
    enabled: !!creditCardId,
  });
};
```

## 🎨 UI Components

### 1. Traditional vs Infinite Pagination

#### Traditional Pagination

- **Best for**: Precise navigation, known total counts, table-like interfaces
- **Features**: Page numbers, jump to specific pages, clear boundaries
- **TanStack Query**: Uses `useQuery` with `keepPreviousData`

#### Infinite Pagination

- **Best for**: Social feeds, mobile interfaces, continuous browsing
- **Features**: Load more buttons, infinite scroll, no page boundaries
- **TanStack Query**: Uses `useInfiniteQuery` with automatic page management

```typescript
// Choose based on your use case:
// Traditional - for data tables, reports, search results
<CreditCardTransactionsList creditCardId={id} />

// Infinite - for feeds, mobile apps, continuous browsing
<CreditCardTransactionsInfinite creditCardId={id} />
```

### 2. Pagination Component

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) => {
  // Implementation with Previous/Next buttons and page numbers
};
```

### 3. Filter Component

```typescript
interface FilterProps {
  params: TransactionPaginationParams;
  onParamsChange: (params: TransactionPaginationParams) => void;
}

const TransactionFilters = ({ params, onParamsChange }: FilterProps) => {
  // Collapsible filter interface with all filter options
};
```

## 🔄 Query Key Strategy

When using React Query, include all parameters in the query key to ensure proper caching and refetching:

```typescript
const queryKey = ['credit-card-transactions', creditCardId, params];
```

This ensures that:

- Different parameter combinations are cached separately
- Changing filters triggers new API calls
- Cache is invalidated correctly when data changes

## 📱 Responsive Design

The pagination and filter components are designed to be responsive:

- **Mobile**: Simplified pagination with Previous/Next only
- **Tablet**: Condensed filter grid layout
- **Desktop**: Full filter interface with all options visible

## ⚡ Performance Considerations

### 1. Debounced Search

For text search fields, implement debouncing to avoid excessive API calls:

```typescript
const debouncedSearch = useDebouncedCallback(
  (value: string) => handleFilterChange({ description_contains: value }),
  300
);
```

### 2. Query Optimization

- Use `keepPreviousData: true` in React Query for smoother transitions
- Implement infinite scroll for large datasets when appropriate
- Cache filter presets for frequently used combinations

### 3. Default Parameters

Always provide sensible defaults:

```typescript
const defaultParams: TransactionPaginationParams = {
  page: 1,
  per_page: 20,
  sort_by: 'date',
  sort_order: 'desc',
};
```

## 🛠️ Extension Guide

### Adding New Filter Types

1. **Update the interface**:

```typescript
interface TransactionPaginationParams {
  // ... existing fields
  new_filter_field?: string;
}
```

2. **Add to filter component**:

```typescript
<Select
  value={params.new_filter_field || ''}
  onValueChange={(value) => updateParam('new_filter_field', value)}
>
  {/* Options */}
</Select>
```

3. **Update backend API** to handle the new parameter

### Extending to Other Transaction Types

The pagination system can be extended to account transactions, broker transactions, etc.:

1. Create similar parameter interfaces
2. Implement corresponding API functions
3. Create transaction-specific filter components
4. Reuse the base Pagination component

## 📚 Related Files

- `/src/domains/credit-cards/types/types-and-interfaces.ts` - Type definitions
- `/src/domains/credit-cards/api/credit-cards.api.ts` - API implementation
- `/src/domains/credit-cards/hooks/use-credit-card-transactions.ts` - React Query hook
- `/src/domains/credit-cards/components/credit-card-transactions-list.tsx` - Main list component
- `/src/domains/credit-cards/components/credit-card-transaction-filters.tsx` - Filter component
- `/src/domains/ui-system/components/pagination.tsx` - Reusable pagination component

## 🚀 Future Enhancements

- **Saved Filters**: Allow users to save and recall filter presets
- **Export Functionality**: Export filtered transaction lists to CSV/PDF
- **Real-time Updates**: WebSocket integration for live transaction updates
- **Advanced Analytics**: Add charts and graphs based on filtered data
- **Bulk Operations**: Select and perform actions on multiple transactions
