# TanStack Query Style Guide

## 1. Query Key Conventions

### 1.1 Query Key Structure

```typescript
// ✅ DO: Use constants for query keys
const ACCOUNTS_KEYS = {
  all: ['accounts'] as const,
  lists: () => [...ACCOUNTS_KEYS.all, 'list'] as const,
  list: (filters: AccountFilters) => [...ACCOUNTS_KEYS.lists(), filters] as const,
  details: () => [...ACCOUNTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ACCOUNTS_KEYS.details(), id] as const,
} as const;

// ❌ DON'T: Use inline query keys
useQuery(['accounts', id, { type: 'detail' }]); // Avoid this
```

### 1.2 Query Key Naming

- Use plural for collections (`accounts`, `transactions`)
- Use singular for single items (`account`, `transaction`)
- Use descriptive action words (`detail`, `list`, `search`)

## 2. Hook Conventions

### 2.1 Hook Naming

```typescript
// ✅ DO: Use clear, descriptive names
useAccounts(); // For getting all accounts
useAccount(id); // For getting a single account
useUpdateAccount(); // For mutations
useDeleteAccount(); // For mutations

// ❌ DON'T: Use generic or unclear names
useAccountData(); // Too vague
useAccountsQuery(); // Redundant 'Query' suffix
```

## 3. Mutations

### 3.1 Mutation Structure

```typescript
// ✅ DO: Use a clear mutation structure
const useUpdateAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountData) => accountsApi.update(id, data),
    onSuccess: data => {
      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: ['accounts', id],
      });
      toast.success('Account updated');
    },
    onError: error => {
      toast.error('Failed to update account');
    },
  });
};

// ❌ DON'T: Mix concerns or skip error handling
const useUpdateAccount = () => {
  return useMutation({
    mutationFn: updateAccount, // Missing proper typing
  });
};
```

### 3.2 Mutation Best Practices

1. **Error Handling**

```typescript
// ✅ DO: Handle errors gracefully
const mutation = useMutation({
  mutationFn: updateAccount,
  onError: (error, variables, context) => {
    if (error instanceof ApiError) {
      toast.error(`Failed: ${error.message}`);
    }
    // Roll back optimistic update if needed
    if (context) {
      queryClient.setQueryData(['accounts'], context.previousAccounts);
    }
  },
});
```

2. **Optimistic Updates**

```typescript
// ✅ DO: Use optimistic updates sparingly and only when confident
const useToggleAccountStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsApi.toggleStatus,
    onMutate: async newStatus => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts', id] });

      // Save previous value
      const previousAccount = queryClient.getQueryData(['accounts', id]);

      // Optimistically update
      queryClient.setQueryData(['accounts', id], old => ({
        ...old,
        status: newStatus,
      }));

      return { previousAccount };
    },
    onError: (err, newStatus, context) => {
      // Roll back
      queryClient.setQueryData(['accounts', id], context.previousAccount);
    },
  });
};

// ❌ DON'T: Use optimistic updates for complex operations
const useCreateAccount = () => {
  // Avoid optimistic updates for creates (need ID) or complex operations
};
```

3. **Mutation States**

```typescript
// ✅ DO: Handle all mutation states
function AccountForm() {
  const updateAccount = useUpdateAccount();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      updateAccount.mutate(formData);
    }}>
      <button
        type="submit"
        disabled={updateAccount.isPending}
      >
        {updateAccount.isPending ? 'Saving...' : 'Save'}
      </button>

      {updateAccount.isError && (
        <ErrorMessage error={updateAccount.error} />
      )}
    </form>
  );
}
```

4. **Side Effects**

```typescript
// ✅ DO: Keep side effects organized and typed
const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: accountsApi.create,
    onSuccess: newAccount => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });

      // Show success message
      toast.success('Account created successfully');

      // Navigate to new account
      navigate(`/accounts/${newAccount.id}`);
    },
  });
};
```

### 3.3 Mutation Lifecycle

1. **Lifecycle Methods**

```typescript
// ✅ DO: Handle the complete mutation lifecycle
const useUpdateAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsApi.update,

    // Before mutation
    onMutate: async newData => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts', id] });
      return {
        /* context */
      };
    },

    // After successful mutation
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts', id] });
    },

    // After error
    onError: (error, variables, context) => {
      // Handle error and rollback if needed
    },

    // After success or error
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['accounts', id] });
    },
  });
};

// ❌ DON'T: Skip lifecycle methods or handle them inconsistently
const useUpdateAccount = () => {
  return useMutation({
    mutationFn: accountsApi.update,
    // Missing error handling and cleanup
  });
};
```

2. **Mutation States**

```typescript
// ✅ DO: Use all available mutation states
const {
  isPending, // Is it running?
  isSuccess, // Did it succeed?
  isError, // Did it fail?
  error, // Error if present
  data, // Success response data
  mutate, // Function to trigger mutation
  mutateAsync, // Async version of mutate
  reset, // Reset mutation state
} = useMutation({ mutationFn });
```

### 3.4 Advanced Patterns

1. **Sequential Mutations**

```typescript
// ✅ DO: Handle sequential mutations properly
const useCreateAccountWithPreferences = () => {
  const createAccount = useCreateAccount();
  const createPreferences = useCreatePreferences();

  const createBoth = async (data: NewAccountData) => {
    // Use mutateAsync for sequential operations
    const account = await createAccount.mutateAsync(data);
    await createPreferences.mutateAsync({
      accountId: account.id,
      preferences: data.preferences,
    });
    return account;
  };

  return {
    createBoth,
    isPending: createAccount.isPending || createPreferences.isPending,
    isError: createAccount.isError || createPreferences.isError,
    error: createAccount.error || createPreferences.error,
  };
};
```

2. **Retry Logic**

```typescript
// ✅ DO: Configure retry behavior appropriately
const useUpdateAccount = () => {
  return useMutation({
    mutationFn: accountsApi.update,
    retry: (failureCount, error) => {
      // Only retry on network errors, max 3 times
      return error instanceof NetworkError && failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

3. **Batch Mutations**

```typescript
// ✅ DO: Handle batch operations efficiently
const useBatchUpdateAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accounts: Account[]) => {
      // Process in batches of 5
      const batchSize = 5;
      const results = [];

      for (let i = 0; i < accounts.length; i += batchSize) {
        const batch = accounts.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(accountsApi.update));
        results.push(...batchResults);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
```

4. **Persistent Mutations**

```typescript
// ✅ DO: Handle offline scenarios with persistent mutations
const useCreateAccount = () => {
  return useMutation({
    mutationFn: accountsApi.create,
    onMutate: async variables => {
      // Store mutation in localStorage for offline support
      await persistMutation('create-account', variables);
    },
    retry: true,
    retryDelay: 1000,
  });
};
```

```

// ❌ DON'T: Use generic or unclear names
useAccountData()        // Too vague
useAccountsQuery()      // Redundant 'Query' suffix
```

### 2.2 Hook Structure

```typescript
// ✅ DO: Organize hooks consistently
export function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: ACCOUNTS_KEYS.list(filters),
    queryFn: () => accountsApi.getAccounts(filters),
    staleTime: STALE_TIMES.MEDIUM,
    gcTime: GC_TIMES.MEDIUM,
  });
}

// ❌ DON'T: Mix concerns or skip type safety
export function useAccounts() {
  const queryClient = useQueryClient(); // Don't mix with mutation logic
  return useQuery(['accounts'], fetchAccounts); // Don't use inline keys
}
```

## 3. API Layer Integration

### 3.1 API Module Structure

```typescript
// ✅ DO: Create domain-specific API modules
// app/domains/accounts/api.ts
export const accountsApi = {
  getAccounts: async (filters?: AccountFilters): Promise<Account[]> => {
    const response = await fetch('/api/accounts?' + new URLSearchParams(filters));
    if (!response.ok) throw new ApiError('Failed to fetch accounts');
    return response.json();
  },
  // ... other methods
};

// ❌ DON'T: Mix API concerns or skip error handling
const fetchAccounts = async () => {
  const res = await fetch('/api/accounts');
  return res.json(); // Missing error handling
};
```

## 4. Type Safety

### 4.1 Type Definitions

```typescript
// ✅ DO: Define comprehensive types
interface UseAccountsOptions {
  filters?: AccountFilters;
  config?: {
    staleTime?: number;
    gcTime?: number;
  };
}

// ❌ DON'T: Use any or unknown types
function useAccounts(options: any); // Avoid this
```

### 4.2 Error Handling

```typescript
// ✅ DO: Use custom error types
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ❌ DON'T: Use generic Error type
catch (error: Error) // Avoid this
```

## 5. Configuration Constants

### 5.1 Time Constants

```typescript
// ✅ DO: Define reusable time constants
export const STALE_TIMES = {
  FAST: 1000 * 30, // 30 seconds
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  SLOW: 1000 * 60 * 30, // 30 minutes
} as const;

export const GC_TIMES = {
  FAST: 1000 * 60, // 1 minute
  MEDIUM: 1000 * 60 * 10, // 10 minutes
  SLOW: 1000 * 60 * 60, // 1 hour
} as const;
```

## 6. Component Integration

### 6.1 Loading States

```typescript
// ✅ DO: Handle all states explicitly
const BrokersList = () => {
  const { data: brokers, isLoading, error } = useBrokers();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!brokers || brokers.length === 0) return <EmptyState />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 bg-section-background rounded-3xl p-6">
      {brokers.map(broker => (
        <li key={broker.id}>
          <BrokerCard broker={broker} />
        </li>
      ))}
    </ul>
  );
};

// ❌ DON'T: Mix loading states with data rendering
function AccountsList() {
  const { data, isLoading } = useAccounts();
  return (
    <div>
      {isLoading ? <Spinner /> : data?.map(...)} // Avoid this pattern
    </div>
  );
}
```

### 6.2 Background Updates

```typescript
// ✅ DO: Show background loading states
function AccountBalance() {
  const { data, isFetching } = useAccount(id);

  return (
    <div>
      {data.balance}
      {isFetching && <BackgroundSpinner />}
    </div>
  );
}
```

## 7. File Organization

```
domains/
  accounts/
    api/
      accounts.api.ts      # API functions
      accounts.types.ts    # API types
    hooks/
      use-accounts.ts      # Query hooks
      use-account.ts       # Single account hooks
      use-account-mutations.ts  # Mutation hooks
    components/
      accounts-list.tsx    # Components using the hooks
```

## 8. Testing Patterns

### 8.1 Hook Tests

```typescript
// ✅ DO: Test hooks with proper setup
describe('useAccounts', () => {
  it('should handle successful fetch', async () => {
    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toMatchSnapshot();
  });
});
```
