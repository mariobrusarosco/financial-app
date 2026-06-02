# Debounced Inputs

Use TanStack Pacer when an input should update immediately in the UI but should not trigger filtering, querying, or expensive work on every keystroke.

## Preferred Pattern

- If the same component owns both the input value and the query value, prefer `useDebouncedValue`.
- If a parent owns the committed value and a child input must stay responsive, use `useDebouncedControlledValue`.
- Keep selects, checkboxes, and other discrete controls immediate unless they have the same keystroke-driven problem.

## Why

- The user sees every keystroke immediately.
- The query or filter change only happens after a short pause.
- Parent-controlled inputs still need a draft layer, but that complexity should live in one narrow hook instead of every filter.

## Local Query Example

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });

<Input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />;
```

## Parent-Controlled Input Example

```tsx
const { draftValue: searchDraft, setDraftValue: setSearchDraft } = useDebouncedControlledValue({
  value,
  onChange,
  wait: 400,
});

<Input value={searchDraft} onChange={event => setSearchDraft(event.target.value)} />;
```
