# TanStack Query v5 Documentation

## Overview
TanStack Query (formerly React Query) is a powerful data-fetching and state management library that solves one of the most complex challenges in web applications: handling server state.

## Why TanStack Query?
Server state is fundamentally different from client state because it:
- Is stored remotely
- Requires async APIs
- Can be modified by others
- May become stale
- Needs caching

## Core Features
1. **Automatic Caching**
   - Built-in caching mechanism
   - Smart background data updates
   - Structural sharing for performance

2. **Request Management**
   - Deduplication of identical requests
   - Automatic retry on failure
   - Request cancellation
   - Parallel queries support

3. **State Management**
   - Real-time synchronization
   - Optimistic updates
   - Infinite scroll and pagination
   - Memory management and garbage collection

## Main Concepts

### 1. Queries
```typescript
const { data, isPending, isError, error } = useQuery({
  queryKey: ['uniqueKey'],
  queryFn: async () => {
    const response = await fetch('/api/data');
    return response.json();
  }
});
```

### 2. Query States
- `isPending`: Initial loading
- `isError`: Query failed
- `isSuccess`: Data available
- `isFetching`: Background refresh

### 3. Query Keys
- Unique identifiers for queries
- Can be nested arrays for dynamic queries
- Used for cache management
```typescript
// Simple key
['todos']

// Composite key
['todo', { id: 5 }]
```

### 4. Query Functions
- Must return a Promise
- Should either resolve data or throw error
- Can use any async data fetching method

## Best Practices

### 1. Treat Query Keys Like Dependency Arrays
- Query keys should include all variables that affect the query
- Changes to query key variables trigger automatic refetches
- Perfect for handling filters and pagination
```typescript
// Good: state is both in queryKey and used in queryFn
const useTodosQuery = (state: 'all' | 'active') => 
  useQuery({
    queryKey: ['todos', state],
    queryFn: () => fetchTodos(state)
  });
```

### 2. Keep Server and Client State Separate
- Don't store query results in local state
- Use `staleTime` for form initializations
- Handle editable server data carefully
```typescript
// Good: Using staleTime for form initialization
const { data } = useQuery({
  queryKey: ['formDefaults'],
  queryFn: fetchDefaults,
  staleTime: Infinity
});
```

### 3. Leverage the Enabled Option
- Control when queries should run
- Perfect for dependent queries
- Useful for temporary disabling during modals
- Wait for user input before fetching
```typescript
const { data } = useQuery({
  queryKey: ['data', filters],
  queryFn: () => fetchData(filters),
  enabled: filters.isValid
});
```

### 4. Smart Cache Management
- Don't use queryCache as local state
- Use `setQueryData` only for:
  - Optimistic updates
  - Server response updates
- Consider `initialData` for better UX
- Implement proper cache invalidation

### 5. Error and Loading States

#### Understanding Loading States
- `isPending`: Initial loading with no data available
- `isFetching`: Any background loading state (can occur with data present)
- `isSuccess`: Data is available
- `isError`: Query encountered an error

#### Smart Status Handling
```typescript
// Traditional Approach (Not Always Optimal)
const { isPending, isError, data, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
});

if (isPending) return 'Loading...';
if (isError) return `Error: ${error.message}`;
return <div>{data.map(todo => <Todo {...todo} />)}</div>;

// Better Approach for Background Updates
const { data, error, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
});

if (data) {
  return (
    <div>
      {data.map(todo => <Todo {...todo} />)}
      {isError && <ErrorBanner error={error} />}
    </div>
  );
}
if (isError) return `Error: ${error.message}`;
return 'Loading...';
```

#### Best Practices
1. **Prioritize Data Display**
   - Show stale data during background updates
   - Don't replace existing data with error screens
   - Use background indicators for refetching

2. **Error Handling**
   - Implement error boundaries for unexpected errors
   - Show user-friendly error messages
   - Consider toast notifications for background errors

3. **Loading Indicators**
   - Use skeleton screens for initial loads
   - Show subtle loading states for background updates
   - Consider delayed loading indicators to prevent flashing

### 6. Performance Optimization
- Use selective updates
- Implement pagination
- Enable background fetching
- Set appropriate `staleTime` values
- Use prefetching for better UX

## Integration with TypeScript
TanStack Query has excellent TypeScript support:
```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const { data } = useQuery<Todo[]>({
  queryKey: ['todos'],
  queryFn: fetchTodos
});
```

## Conclusion
TanStack Query is an essential tool for modern React applications that need to handle server state effectively. It provides a robust solution for data fetching, caching, and state management while maintaining excellent developer experience and type safety.
