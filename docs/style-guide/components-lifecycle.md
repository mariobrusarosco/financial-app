# Components Lifecycle

A Component should follow this order:

- Loading
- Error or Success
- Content

No matter the state, the component should always occupy the same space.

## Component Responsibilities

A component should focus on rendering:

- layout
- visual states
- markup

When a component depends on fetched or derived data, it should consume a UI-oriented hook from its domain instead of shaping raw query output inside the `.tsx` file.

This hook should be the composition layer between domain hooks and the component. It is responsible for:

- consuming lower-level hooks
- deriving view-specific state
- exposing a stable UI contract

The mandatory contract is:

- `query`
- `actions`

This means the component should not be responsible for:

- calling raw query hooks when the view needs derived state
- sorting, filtering, slicing, or adapting server data for presentation
- naming UI booleans from raw query output
- composing handlers from multiple hooks

* Avoid pushing data orchestration into the component
* Prefer composing the data in a UI-oriented hook and keeping the component focused on rendering:

## Creating a UI-oriented hook

```tsx
<resourceName>: {
	query,
	actions: {
		refetch<ResourceName>: query.refetch,
	},
},
```

```tsx
export const useLeagues = () => {
  const queryClient = useQueryClient();

  const leaguesQuery = useQuery({
    queryKey: leaguesQueryKey(),
    queryFn: getLeagues,
  });

  const createLeagueMutation = useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      alert('League created successfully');
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
    onError: () => {
      alert('Failed to create league');
    },
  });

  return {
    leagues: {
      query: leaguesQuery,
      actions: {
        refetch: leaguesQuery.refetch,
      },
    },
    league: {
      mutation: createLeagueMutation,
    },
  };
};
```

## Using a Hook with the UI-friendly contract

The hook return should expose the query only through the resource contract:

```tsx
const {
  accounts: { query, actions },
} = useAccounts();
```

Do not expose the same query twice by spreading query fields at the hook root:

```tsx
// Bad
return {
  ...accountsQuery,
  accounts: {
    query: accountsQuery,
    actions: {
      refetchAccounts: accountsQuery.refetch,
    },
  },
};
```

```tsx
// Good
return {
  accounts: {
    query: accountsQuery,
    actions: {
      refetchAccounts: accountsQuery.refetch,
    },
  },
};
```

## Data Transformation For UI

Data returned by hooks often needs to be shaped for UI/UX: grouped, sorted, mapped to select options, or adapted into card data. Follow this order:

1. **Prefer API filters when the transformation changes which records are fetched.**

```tsx
const {
  accounts: { query },
} = useAccounts({
  params: { is_active: true, type: 'investment' },
});
```

Use API params for filtering, pagination, search, date ranges, ownership, status, and other constraints that affect dataset size or query semantics.

2. **Use named domain selectors for local UI projections.**

```ts
groupAccountsByType(accounts);
sortAccountsByName(accounts);
toAccountSelectOptions(accounts);
```

Selectors should be named by the UI or domain meaning they provide. Avoid anonymous `filter`, `sort`, `map`, `reduce`, and grouping pipelines inside component markup.

3. **Use React Query `select` when a consumer wants `query.data` in a specific UI shape.**

```tsx
const {
  accounts: { query },
} = useAccounts({
  params: { is_active: true },
  select: groupAccountsByType,
});
```

`select` keeps the server cache tied to the query while letting each consumer receive the shape it needs. Another consumer can use the same account query with a different selector:

```tsx
const {
  accounts: { query },
} = useAccounts({
  params: { is_active: true },
  select: toAccountSelectOptions,
});
```

This keeps transformations opt-in instead of forcing every `useAccounts` consumer to receive every possible UI projection.

4. **Compose selectors when a UI needs multiple meaningful transformations.**

```ts
const activeAccounts = filterActiveAccounts(accounts);
const groupedAccounts = groupAccountsByType(activeAccounts);
const sortedGroups = sortAccountGroupsByPriority(groupedAccounts);
```

Each step should express business or UI meaning. If a step cannot be named clearly, the transformation is probably not understood well enough yet.

## Lifecycle States

1. _Loading_:
   A Skeleton is used while the data of the component is not loaded yet.
2. In case of an **Error**
   We display a friendly message to the user. The exception is when we're absolutely sure the Back End has returned the friendly message for us.
3. **Empty State**:

- If there's _no error_ , _data is not being fetched_ but there's _no data_, we display a friendly message accordingly to what we would display in case of _success_.

4. _Content_:

- If there's _no error_ , _data was fetched_ and we _have data_, we display the content of the component.
