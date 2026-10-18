# Phase 2 - Inline Tagging on the Transaction Row (+ Category Removal)

## Goal
Let users tag a transaction directly from its row in the list, Notion-style: click the tag line, search, toggle, or create a tag, and close to save. This replaces the legacy "Uncategorized" category line. Then remove every remaining reference to categories from the frontend, since tags supersede them.

## Agreed Decisions
- **Save timing:** edits stay local while the picker is open; **one** `PATCH /transactions/:id { tag_ids }` on close (only if the selection changed). The UI updates optimistically and rolls back on error.
- **New tags:** created **ungrouped** (`dimension_id: null`). No dimension picker in the create flow.
- **Suggestions:** ~~temporary URL + hardcoded mock~~. Dropped: no backend endpoint.
- **Categories:** remove all references (Phase 4).

## UX Spec
- **Row trigger:** the line under the description shows tag chips (max 3, then `+N`). It shows `Add tags` when empty. The whole line is a button that opens the picker.
- **Picker (popover, anchored to the trigger):**
  - Top: input that also holds the selected chips (each removable with ✕).
  - Optional "Suggested" section (Phase 3), excluding already-selected tags.
  - Tags grouped by dimension, with a `Choose one` / `Choose any` hint. Picking a tag in a `single` dimension replaces its sibling.
  - Last option when the query has no exact match: `Create "<query>"` (ungrouped). It creates the tag and selects it.
  - Keyboard: `↑↓` move, `↵` toggle/create, `⌫` on empty input removes the last chip, `Esc` or click outside closes and saves.
  - Limit: 20 tags per transaction (existing rule).
- Reference mockup: the interactive prototype shared in the planning conversation.

## Tasks

### Task 1 - Shared Tag Picker Foundation [x]
#### Task 1.1 - Extract tag selection rules into utils [x]
- Move `groupTagsForSelection`, `mergeReadableTags`, the sort helpers, the single-dimension toggle rule, and `MAX_SELECTED_TAGS` out of `src/domains/tags/components/tag-selector.tsx` into `src/domains/tags/utils/tag-selection.ts`.
- Add unit tests (`tag-selection.test.ts`): grouping/sorting, single-mode replacement, the 20-tag limit, and search filtering.
#### Task 1.2 - Build `TagPicker` on cmdk [x]
- New `src/domains/tags/components/tag-picker.tsx`, built on `@/domains/ui-system/components/command` (cmdk).
- Props: `value`, `onValueChange`, `historicalTags?`, `suggestions?`.
- Implements the chips input, grouped list, create option, and keyboard behavior from the UX spec.
#### Task 1.3 - Inline tag creation [x]
- `Create "<query>"` calls `useTags().tags.mutations.create.mutateAsync({ name, dimension_id: null })`, then appends the new id to the selection and clears the query.
- Duplicate-name or API errors use the existing `showTagError` toast, and the selection stays unchanged.
#### Task 1.4 - Make `TagSelector` reuse `TagPicker` [x]
- `TagSelector` keeps its trigger and renders `TagPicker` inside its popover. The drawer and bulk actions gain "Create" and keyboard support at no extra cost.

### Task 2 - Transaction Row Integration [x]
#### Task 2.1 - `use-update-transaction-tags` hook [x]
- New `src/domains/transactions/hooks/use-update-transaction-tags.ts`: a mutation around `updateTransaction(id, { tag_ids })`.
- `onMutate`: cancel queries, then optimistically patch `tag_ids` + `tags` in every `['account-transactions-paginated']` cache and in `['transaction', id]`.
- `onError`: restore the snapshot, then show an error toast.
- `onSettled`: `invalidateAllTransactionRelatedQueries(queryClient)` (from `use-update-transaction.ts`).
#### Task 2.2 - `TransactionTagsCell` component [x]
- New `src/domains/transactions/components/transaction/transaction-tags-cell.tsx`: chips + `+N` + `Add tags` trigger, with a popover containing `TagPicker`.
- Holds a draft selection while open. On close, if the draft differs from `transaction.tag_ids`, it calls the hook from 2.1.
- Must not toggle the row's selection checkbox or other row interactions.
#### Task 2.3 - Replace the category line in rows [x]
- Swap `TransactionCategory` for `TransactionTagsCell` in `transaction-item-default.tsx` and `transaction-item-compact.tsx`.

### Task 3 - Tag Suggestions (Mocked Endpoint) [removed]
> **Removed (2026-10-08):** the backend has no suggestions endpoint and none is planned, so the mock, `getTagSuggestions`, `TAG_QUERY_KEYS.suggestions`, `use-tag-suggestions.ts`, and the picker's "Suggested" section were deleted. The subtasks below are kept for history.
#### Task 3.1 - Types [x]
- In `src/domains/tags/types/types-and-interfaces.ts`: `export type I_TagSuggestionsResponse = I_Tag[];`
#### Task 3.2 - API function with temporary URL + override [x]
- In `tagsApi` (`src/domains/tags/api/tags.api.ts`): `getTagSuggestions(transactionId)`. This is **temporary**: `GET /tags/suggestions?transaction_id=<id>` (`TAG_SUGGESTIONS_PATH` constant).
- Until the backend exists, the function returns a hardcoded `MOCK_TAG_SUGGESTIONS` array of 5 `I_Tag` objects instead of calling `apiClient`. Mark it with a `TODO(tag-suggestions)` comment so it's easy to find and remove.
#### Task 3.3 - Query key + hook [x]
- `TAG_QUERY_KEYS.suggestions(transactionId)` in `src/domains/tags/api/keys.ts`.
- New `src/domains/tags/hooks/use-tag-suggestions.ts`: `useQuery` with `enabled` only while that row's picker is open (no N requests for a 100-row page), `staleTime: 5 min`.
#### Task 3.4 - "Suggested" section in `TagPicker` [x]
- Rendered above the groups, hiding tags that are already selected. One click or `↵` selects.
- Inline suggestion chips directly on untagged rows (as in the mockup) are deferred. They need a batch endpoint (e.g. `POST /tags/suggestions { transaction_ids }`) to avoid one request per row.

### Task 4 - Remove All Category References [x]
Inventory: 60 files, ~500 matches. Grouped by kind of change. Each group should be its own PR.

#### Task 4.1 - Category domain and management UI (delete) [x]
- [x] Category manager removed: `category-manager.tsx`, `category-manager-drawer.tsx`, `category-manager-button.tsx`, the `'category-manager'` drawer type, and the button in `account-transactions-list.tsx`.
- [x] Delete the rest of `src/domains/categories/` (api, hooks, types, utils) **last**, once Tasks 4.2–4.5 have removed its importers (installments, subscriptions, cashflow, category selectors). Deleting it earlier breaks the build.
#### Task 4.2 - Transaction UI (delete) [x]
- Delete `transaction/transaction-category.tsx`, `category-selector.tsx`, `hierarchical-category-selector.tsx`, `transactions/utils/categories.ts`.
- Remove category logic from `transactions/utils/transaction-formatting.ts`, `TransactionCategoryProps` in `transaction/types.ts`, and the `categoryName` prop of `transaction-icon-badge.tsx` (icon then derives from movement type only).
- `use-account-transactions-combined.ts`, `use-editable-transactions.ts`, `credit-cards/hooks/use-editable-credit-card-transactions.ts`, `credit-cards/types`.
#### Task 4.3 - Filters, sorting, and route search params (replace) [x]
- Remove `category` search param and `sort_by: 'category'` from `routes/(auth)/transactions/index.tsx` and `routes/(auth)/accounts/$slug/{index,income/index,expenses/index}.tsx`, and `params.category` from the three account screens.
- `account-transaction-filters.tsx` and `credit-card-transaction-filters.tsx`: replace the category filter with a tag filter using the existing `tag_ids` / `tag_match` / `exclude_tag_ids` params. **(decided: tag filter)**
#### Task 4.4 - Analytics and breakdowns (replace or delete) [x]
- `cashflow/utils/grouping-utils.ts`, `cashflow/components/expenses/expenses-by-category.tsx`, `cashflow/screens/cashflow-expenses-screen.tsx`, `transactions/components/account-transaction-analyzer.tsx`, `ui-system/components/tremor-charts.tsx`, `ui-system/utils/color-generator.ts`, `installments/components/installments-category-breakdown.tsx`, `subscriptions/components/subscriptions-category-breakdown.tsx` (+ their screens and `subscriptions/components/index.ts`), and `dashboard/screens/index.tsx`. **(decided: delete for now)**
#### Task 4.5 - Subscriptions and installments forms/types (delete) [x]
- Remove `category_id` from `subscriptions/types`, `installments/types`, `subscription-form.tsx`, `installment-form.tsx`, `create-installment-drawer.tsx`, `installment-calculators.ts`. Also remove `category_breakdown` (subscriptions), whose source is the backend.
- Confirm the backend accepts payloads without `category_id`.
#### Task 4.6 - Misc leftovers [x]
- `global/utils/error-handler.ts`, `server-functions/pdf-parser.ts`, `data-transfer/type/types-and-interfaces.ts`, both statement refinement processes (accounts + credit cards), `testing/test-data.ts`.
- Final check: `grep -riE "categor" src` returns nothing, except unrelated wording if any.

### Task 5 - Verification []
#### Task 5.1 - Typecheck, lint, tests [x]
- `yarn typecheck`, `yarn lint`, `yarn test`. No new errors relative to the baseline (the repo currently has pre-existing typecheck and lint errors and 3 failing tests in `create-account.test.tsx`).
#### Task 5.2 - Manual verification []
- Tag/untag from a row and confirm the optimistic update. Simulate an API failure and confirm the rollback.
- Create a tag inline. Check "choose one" replacement, the 20-tag limit, and keyboard-only usage.
- The drawer's tag selector still works and now supports Create. Bulk tag actions still work.

## Implementation Notes (deviations from the original plan)
- **Optimistic update lives in the row, not the caches.** Rows render in about 10 lists with different cache shapes (paginated, infinite, credit-card, recent…). `TransactionTagsCell` shows the pending selection until the row's `updated_at` changes and reverts on error. `use-update-transaction-tags` then invalidates all transaction-related queries.
- **Inline editing is opt-in (`canEditTags`).** Rows in the statement/invoice refinement flows are not persisted yet, so they stay read-only, as do the payment-link pickers. It's enabled in `account-transactions-list`, `transactions-list`, `credit-card-transactions-list`, `credit-card-transactions-infinite`.
- **`transaction-item-compact.tsx` was not changed.** It isn't rendered anywhere and already fails to compile. It's handled by Task 4.2.
- **Limit rule fix:** a single-dimension swap is now allowed even when the selection is full (20 tags), because the count doesn't change.

## Category Removal Notes
- **Credit-card filters:** the category filter and sort option were removed but **not** replaced with a tag filter. `I_CreditCardTransactionsParams` and the credit-card endpoints have no tag params, and we don't guess APIs. Add one once the backend supports it.
- **Account filters:** the category filter was replaced with a `TagSelector` bound to `tag_ids` (URL search param `tag_ids` on the account overview/income/expenses routes). `tag_match` uses the backend default.
- **Deleted:** `src/domains/categories/`, `category-selector.tsx`, `hierarchical-category-selector.tsx`, `transaction-category.tsx`, `transaction-item-compact.tsx` (unused, already broken), `transactions/utils/categories.ts`, `account-transaction-analyzer.tsx`, `expenses-by-category.tsx`, `installments-category-breakdown.tsx`, `subscriptions-category-breakdown.tsx`.
- **Row icon:** `TransactionIconBadge` always shows `DollarSign`. It was derived from the category name, which rows no longer have.
- **Dashboard recent transactions:** shows tag names (or "No tags") instead of the category.
- **PDF parser prompt:** the `category` field was removed from the extraction schema.
- **Subscriptions:** ~~the form previously required a category~~. **Resolved:** the backend dropped `subscriptions.category_id` (migration `c1a9f34d2e10`). `POST /subscriptions` takes an optional `tag_ids` (UUID list, defaults to `[]`), and the response includes `tag_ids` + `tags`. `PATCH` with `tag_ids` replaces the whole set: `[]` or `null` clears it, and omitting it keeps the current tags.
- **Intentionally kept (unrelated meaning):** `ErrorCategory` in `error-handler.ts`, Tremor's `categories=` chart props, a comment in `color-generator.ts`, and the "Category" tag *dimension* used in `tag-selection.test.ts`.

## Resolved Decisions (Task 4 / mock)
1. **Category filters:** replace them with a tag filter using the existing `tag_ids` / `tag_match` / `exclude_tag_ids` params.
2. **Category analytics:** delete these views for now (cashflow "expenses by category", subscription/installment breakdowns, analyzer category sections).
3. **Mock suggestions:** ~~a hardcoded array of 5 tags~~. Feature removed.

## Dependencies
- cmdk (already installed, wrapped in `ui-system/components/command.tsx`)
- TanStack Query optimistic updates
- Existing tags API (`createTag`) and `PATCH /transactions/:id` accepting `tag_ids`
- Backend: suggestions endpoint (pending), confirmation that `category_id` can be dropped from subscriptions and installments

## Expected Result
Users tag transactions straight from the list with a fast, keyboard-friendly picker that can also create tags. The drawer and bulk actions share the same picker. Suggestions appear (mocked) when opening the picker. The frontend no longer contains any category concept.

## Next Steps
Review the plan and the open decisions, then start with Task 1.1 once approved.
