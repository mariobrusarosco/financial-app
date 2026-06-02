# Multiple Queries Guide: Combining Data from Multiple Sources

This guide demonstrates how to effectively combine data from multiple API endpoints using TanStack Query, with practical examples from our financial app's combined transactions feature.

## Overview

When building complex applications, you often need to fetch data from multiple endpoints and combine them into a single, cohesive view. This guide covers patterns, best practices, and common pitfalls when working with multiple queries.

## Table of Contents

1. [Basic Multiple Query Patterns](#basic-multiple-query-patterns)
2. [Real-World Example: Combined Transactions](#real-world-example-combined-transactions)
3. [Advanced Patterns](#advanced-patterns)
4. [Performance Considerations](#performance-considerations)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)
7. [Common Pitfalls](#common-pitfalls)

## Basic Multiple Query Patterns

### Pattern 1: Independent Parallel Queries

```typescript
// Multiple independent queries that don't depend on each other
const useUserDashboard = (userId: string) => {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUser(userId),
  });

  const notificationsQuery = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationApi.getUserNotifications(userId),
  });

  const settingsQuery = useQuery({
    queryKey: ['settings', userId],
    queryFn: () => settingsApi.getUserSettings(userId),
  });

  return {
    user: userQuery.data,
    notifications: notificationsQuery.data,
    settings: settingsQuery.data,
    isLoading: userQuery.isLoading || notificationsQuery.isLoading || settingsQuery.isLoading,
    isError: userQuery.isError || notificationsQuery.isError || settingsQuery.isError,
  };
};
```

### Pattern 2: Dependent Sequential Queries

```typescript
// Queries that depend on data from previous queries
const useUserWithProjects = (userId: string) => {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUser(userId),
    enabled: !!userId,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', userQuery.data?.teamId],
    queryFn: () => projectApi.getTeamProjects(userQuery.data!.teamId),
    enabled: !!userQuery.data?.teamId, // Wait for user data first
  });

  return {
    user: userQuery.data,
    projects: projectsQuery.data,
    isLoading: userQuery.isLoading || (userQuery.data && projectsQuery.isLoading),
    isError: userQuery.isError || projectsQuery.isError,
  };
};
```

## Real-World Example: Combined Transactions

Our financial app combines account transactions and credit card transactions into a single paginated view. This demonstrates a complex multiple query pattern with data transformation and client-side pagination.

### The Problem

We needed to:

- Fetch account transactions from `/accounts/{id}/transactions`
- Fetch credit card transactions from `/credit_cards/{id}/transactions` for each credit card
- Combine, filter, sort, and paginate the results
- Show transaction type indicators (Account vs Credit)

### The Solution

```typescript
// File: src/domains/transactions/hooks/use-account-transactions-combined.ts

export const useAccountTransactionsCombined = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => {
  // First, get credit cards for this account
  const { data: creditCardsData } = useCreditCards(accountId);
  const creditCards = creditCardsData?.data || [];
  const creditCardIds = creditCards.map(card => card.id);

  return useQuery({
    queryKey: GET_ACCOUNT_TRANSACTIONS_COMBINED_QUERY_KEY(accountId, params),
    queryFn: async (): Promise<I_AccountTransactionsResponse> => {
      try {
        // Step 1: Prepare all API calls (remove pagination to get ALL data)
        const accountTransactionsPromise = transactionsApi.getAccountTransactions(accountId, {
          ...params,
          page: undefined,
          per_page: undefined, // Get all transactions
        });

        const creditCardTransactionsPromises = creditCardIds.map(creditCardId =>
          creditCardApi.getCreditCardTransactions(creditCardId, {
            page: undefined,
            per_page: undefined, // Get all transactions
            date_from: params?.date_from,
            date_to: params?.date_to,
            amount_min: params?.amount_min,
            amount_max: params?.amount_max,
            description_contains: params?.description_contains,
            movement_type: params?.movement_type,
            is_paid: params?.is_paid,
            sort_by: params?.sort_by as any,
            sort_order: params?.sort_order,
          } as I_CreditCardTransactionsParams)
        );

        // Step 2: Execute all queries in parallel
        const [accountTransactions, ...creditCardTransactionsArrays] = await Promise.all([
          accountTransactionsPromise,
          ...creditCardTransactionsPromises,
        ]);

        // Step 3: Transform and combine data
        let allTransactions: I_TransactionResponse[] = [
          ...accountTransactions.data,
          ...creditCardTransactionsArrays.flatMap(ccResponse =>
            ccResponse.data.map(
              transaction =>
                ({
                  // Convert credit card transaction to account transaction format
                  id: transaction.id,
                  account_id: accountId,
                  broker_id: transaction.broker_id,
                  credit_card_id: transaction.credit_card_id, // Key field for UI distinction
                  is_deleted: false,
                  is_paid: transaction.is_paid,
                  date: transaction.date,
                  amount: transaction.amount.toString(),
                  description: transaction.description,
                  movement_type: transaction.movement_type as any,
                  category: transaction.category || '',
                  created_at: transaction.created_at,
                  updated_at: transaction.updated_at,
                }) as I_TransactionResponse
            )
          ),
        ];

        // Step 4: Apply client-side filtering
        if (params?.category) {
          allTransactions = allTransactions.filter(t =>
            t.category?.toLowerCase().includes(params.category!.toLowerCase())
          );
        }

        // Step 5: Sort combined results
        allTransactions.sort((a, b) => {
          const sortBy = params?.sort_by || 'date';
          const sortOrder = params?.sort_order || 'desc';

          let valueA: any, valueB: any;

          switch (sortBy) {
            case 'date':
              valueA = new Date(a.date).getTime();
              valueB = new Date(b.date).getTime();
              break;
            case 'amount':
              valueA = parseFloat(a.amount);
              valueB = parseFloat(b.amount);
              break;
            case 'created_at':
              valueA = new Date(a.created_at).getTime();
              valueB = new Date(b.created_at).getTime();
              break;
            case 'category':
              valueA = a.category || '';
              valueB = b.category || '';
              break;
            default:
              valueA = new Date(a.date).getTime();
              valueB = new Date(b.date).getTime();
          }

          if (sortOrder === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
          } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
          }
        });

        // Step 6: Apply client-side pagination
        const page = params?.page || 1;
        const perPage = params?.per_page || 20;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

        // Step 7: Return paginated response
        const total = allTransactions.length;
        const totalPages = Math.ceil(total / perPage);

        return {
          data: paginatedTransactions,
          meta: {
            total,
            page,
            per_page: perPage,
            has_next: page < totalPages,
            has_previous: page > 1,
          },
        };
      } catch (error) {
        console.error('Error fetching combined transactions:', error);
        // Return empty response on error
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 1,
            per_page: params?.per_page || 20,
            has_next: false,
            has_previous: false,
          },
        };
      }
    },
    enabled: !!accountId && creditCards.length >= 0,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: failureCount => {
      if (failureCount >= 3) return false;
      return true;
    },
  });
};
```

### Key Implementation Details

#### 1. Query Key Stabilization

```typescript
export const GET_ACCOUNT_TRANSACTIONS_COMBINED_QUERY_KEY = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => [
  'account-transactions-combined',
  accountId,
  // Serialize params to ensure stable cache key
  JSON.stringify(params || {}),
];
```

#### 2. Data Transformation

The hook transforms credit card transactions to match the account transaction interface:

```typescript
// The credit_card_id field is the key differentiator
credit_card_id: transaction.credit_card_id, // Populated for credit transactions, undefined for account transactions
```

#### 3. UI Component Usage

```typescript
// The component uses the combined hook seamlessly
export const AccountTransactionsList = ({ accountId }: AccountTransactionsListProps) => {
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const {
    data: response,
    isLoading,
    isError,
    isPlaceholderData,
  } = useAccountTransactionsCombined(accountId, params); // Single hook call!

  // Rest of component logic...
};
```

#### 4. Transaction Type Display

```typescript
// In TransactionCard component
const isCredit = !!creditCardId;
const transactionTypeIcon = isCredit ? CreditCard : Wallet;
const transactionTypeLabel = isCredit ? 'Credit' : 'Account';

// Visual indicator
<span
  className={cn(
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
    isCredit
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  )}
>
  {React.createElement(transactionTypeIcon, { className: 'h-3 w-3' })}
  {transactionTypeLabel}
</span>
```

## Advanced Patterns

### Pattern 3: Dynamic Multiple Queries

```typescript
// Query count depends on data from another query
const useUserWithAllProjects = (userId: string) => {
  const teamsQuery = useQuery({
    queryKey: ['user-teams', userId],
    queryFn: () => userApi.getUserTeams(userId),
  });

  const teams = teamsQuery.data || [];

  // Create queries for each team
  const projectQueries = useQueries({
    queries: teams.map(team => ({
      queryKey: ['team-projects', team.id],
      queryFn: () => projectApi.getTeamProjects(team.id),
      enabled: !!team.id,
    })),
  });

  const allProjects = projectQueries.filter(query => query.data).flatMap(query => query.data);

  return {
    teams,
    projects: allProjects,
    isLoading: teamsQuery.isLoading || projectQueries.some(q => q.isLoading),
    isError: teamsQuery.isError || projectQueries.some(q => q.isError),
  };
};
```

### Pattern 4: Infinite Queries with Multiple Sources

```typescript
const useCombinedInfiniteData = (userId: string) => {
  const postsQuery = useInfiniteQuery({
    queryKey: ['user-posts', userId],
    queryFn: ({ pageParam = 1 }) => postsApi.getUserPosts(userId, pageParam),
    getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
  });

  const commentsQuery = useInfiniteQuery({
    queryKey: ['user-comments', userId],
    queryFn: ({ pageParam = 1 }) => commentsApi.getUserComments(userId, pageParam),
    getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
  });

  // Combine and sort by date
  const combinedData = useMemo(() => {
    const posts =
      postsQuery.data?.pages.flatMap(page => page.posts.map(post => ({ ...post, type: 'post' }))) ||
      [];

    const comments =
      commentsQuery.data?.pages.flatMap(page =>
        page.comments.map(comment => ({ ...comment, type: 'comment' }))
      ) || [];

    return [...posts, ...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [postsQuery.data, commentsQuery.data]);

  return {
    data: combinedData,
    fetchNextPage: () => {
      postsQuery.fetchNextPage();
      commentsQuery.fetchNextPage();
    },
    hasNextPage: postsQuery.hasNextPage || commentsQuery.hasNextPage,
    isLoading: postsQuery.isLoading || commentsQuery.isLoading,
  };
};
```

## Performance Considerations

### 1. Query Parallelization

✅ **Good**: Execute queries in parallel when possible

```typescript
// Parallel execution
const [accountData, creditCardData] = await Promise.all([
  accountApi.getAccount(accountId),
  creditCardApi.getCreditCards(accountId),
]);
```

❌ **Bad**: Sequential execution when not necessary

```typescript
// Sequential execution (slower)
const accountData = await accountApi.getAccount(accountId);
const creditCardData = await creditCardApi.getCreditCards(accountId);
```

### 2. Smart Query Enabling

```typescript
// Only run expensive queries when dependencies are ready
const enabled = !!accountId && creditCards.length >= 0;

const combinedQuery = useQuery({
  queryKey: ['combined-data', accountId],
  queryFn: () => fetchCombinedData(accountId, creditCards),
  enabled, // Don't run until we have all dependencies
});
```

### 3. Pagination Strategy

For combined results, you have two options:

**Client-side Pagination (our choice)**:

- Fetch all data, combine, then paginate
- Better for accurate sorting across sources
- Higher memory usage but better UX

**Server-side Pagination**:

- Create a backend endpoint that combines data
- More efficient but requires backend changes

### 4. Caching Strategy

```typescript
// Use stable query keys to prevent unnecessary refetches
const queryKey = [
  'combined-transactions',
  accountId,
  JSON.stringify(params || {}), // Serialize objects for stability
];
```

## Error Handling

### 1. Graceful Degradation

```typescript
const useCombinedDataWithFallback = (accountId: string) => {
  const primaryQuery = useQuery({
    queryKey: ['primary-data', accountId],
    queryFn: () => primaryApi.getData(accountId),
  });

  const secondaryQuery = useQuery({
    queryKey: ['secondary-data', accountId],
    queryFn: () => secondaryApi.getData(accountId),
    // Continue even if primary fails
    enabled: !!accountId,
  });

  return {
    data: {
      primary: primaryQuery.data || null,
      secondary: secondaryQuery.data || null,
    },
    // Show data even if one source fails
    hasData: !!primaryQuery.data || !!secondaryQuery.data,
    isLoading: primaryQuery.isLoading || secondaryQuery.isLoading,
    errors: {
      primary: primaryQuery.error,
      secondary: secondaryQuery.error,
    },
  };
};
```

### 2. Retry Strategies

```typescript
const retryConfig = {
  retry: (failureCount, error) => {
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) return false;

    // Limit retry attempts
    if (failureCount >= 3) return false;

    return true;
  },
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
};
```

## Best Practices

### 1. Keep Query Logic Separate

```typescript
// ✅ Good: Separate concerns
const useAccountData = (accountId: string) => {
  /* account logic */
};
const useCreditCardData = (accountId: string) => {
  /* credit card logic */
};
const useCombinedTransactions = (accountId: string) => {
  // Combine the above hooks
};

// ❌ Bad: Everything in one hook
const useEverything = (accountId: string) => {
  // 200+ lines of mixed logic
};
```

### 2. Use TypeScript for Safety

```typescript
// Define clear interfaces for combined data
interface CombinedTransaction extends BaseTransaction {
  source: 'account' | 'credit_card';
  credit_card_id?: string;
}

interface CombinedTransactionResponse {
  data: CombinedTransaction[];
  meta: PaginationMeta;
}
```

### 3. Handle Loading States Properly

```typescript
const isInitialLoading = primaryQuery.isLoading && !primaryQuery.data;
const isRefetching = primaryQuery.isFetching && !!primaryQuery.data;
const isLoadingMore = secondaryQuery.isLoading;

// Different UI for different loading states
if (isInitialLoading) return <FullPageSpinner />;
if (isRefetching) return <DataWithRefreshIndicator />;
if (isLoadingMore) return <DataWithLoadMoreSpinner />;
```

### 4. Optimize Re-renders

```typescript
// Use useMemo for expensive computations
const combinedData = useMemo(() => {
  return combineAndSortData(accountData, creditCardData);
}, [accountData, creditCardData]);

// Use useCallback for stable function references
const updateFilters = useCallback(newFilters => {
  setParams(prev => ({ ...prev, ...newFilters, page: 1 }));
}, []);
```

## Common Pitfalls

### 1. Query Key Instability

❌ **Problem**: Causing unnecessary refetches

```typescript
// Object reference changes on every render
const params = { page: 1, limit: 20 };
const query = useQuery(['data', params], ...); // Always refetches!
```

✅ **Solution**: Stable query keys

```typescript
const query = useQuery(['data', JSON.stringify(params)], ...);
// Or use a query key factory
const query = useQuery(getDataQueryKey(params), ...);
```

### 2. Waterfall Queries

❌ **Problem**: Sequential loading

```typescript
const useSlowData = () => {
  const user = useQuery(['user'], fetchUser);
  const projects = useQuery(['projects'], fetchProjects, {
    enabled: !!user.data, // Waits for user to load first
  });
  return { user: user.data, projects: projects.data };
};
```

✅ **Solution**: Parallel when possible

```typescript
const useFastData = () => {
  // Both run in parallel
  const user = useQuery(['user'], fetchUser);
  const projects = useQuery(['projects'], fetchProjects);
  return { user: user.data, projects: projects.data };
};
```

### 3. Memory Leaks with Dynamic Queries

❌ **Problem**: Creating queries in loops without cleanup

```typescript
const BadComponent = ({ items }) => {
  return items.map(item => {
    const query = useQuery(['item', item.id], () => fetchItem(item.id));
    return <ItemDisplay key={item.id} data={query.data} />;
  });
};
```

✅ **Solution**: Use useQueries or move queries to parent

```typescript
const GoodComponent = ({ items }) => {
  const queries = useQueries({
    queries: items.map(item => ({
      queryKey: ['item', item.id],
      queryFn: () => fetchItem(item.id)
    }))
  });

  return items.map((item, index) => (
    <ItemDisplay key={item.id} data={queries[index].data} />
  ));
};
```

### 4. Incorrect Error Boundaries

❌ **Problem**: Not handling partial failures

```typescript
const isError = query1.isError || query2.isError;
if (isError) return <ErrorPage />; // Shows error even if one query succeeds
```

✅ **Solution**: Granular error handling

```typescript
const hasAnyData = query1.data || query2.data;
const hasAnyError = query1.isError || query2.isError;

if (!hasAnyData && hasAnyError) return <ErrorPage />;
if (hasAnyData) return <DataWithPartialErrors />;
```

## Backend Enhancement Update

**Note**: After implementing the client-side multiple queries pattern, our backend team enhanced the `/accounts/{id}/transactions` endpoint with an `include_credit_cards` parameter. This allows us to get the same combined results with a single API call:

```typescript
// Updated implementation using backend enhancement
const useAccountTransactionsPaginated = (
  accountId: string,
  params?: I_AccountTransactionsParams,
  includeCreditCards: boolean = true
) => {
  const queryParams = {
    ...params,
    include_credit_cards: includeCreditCards, // Backend handles the combining
  };

  return useQuery({
    queryKey: GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY(accountId, queryParams),
    queryFn: () => transactionsApi.getAccountTransactions(accountId, queryParams),
    enabled: !!accountId,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
```

This demonstrates an important principle: **start with client-side solutions when you need immediate results, then optimize with backend enhancements when possible**. Both approaches have their place:

- **Client-side combining**: Quick to implement, no backend changes needed
- **Backend combining**: More efficient, better performance, server-side filtering/sorting

## Conclusion

Multiple queries are a powerful pattern for building complex, data-rich applications. Our combined transactions example demonstrates how to:

1. **Fetch data from multiple sources in parallel**
2. **Transform and combine data with type safety**
3. **Handle client-side filtering and pagination**
4. **Provide smooth UX with loading states and error handling**
5. **Optimize performance with stable query keys and memoization**
6. **Evolve from client-side to server-side solutions**

The key is to balance complexity with maintainability, always considering the user experience and application performance.

## Related Patterns

- **Data Normalization**: Consider using libraries like RTK Query for complex relational data
- **Real-time Updates**: Combine with WebSocket subscriptions for live data
- **Optimistic Updates**: Use mutation callbacks to update related queries immediately
- **Background Sync**: Use background refetch strategies for fresh data

---

_This guide uses examples from our financial application's transaction management system. For more patterns and advanced usage, see the [TanStack Query documentation](https://tanstack.com/query/latest)._
