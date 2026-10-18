> **Superseded (2026-10-18):** replaced by [cashflow-views.md](./cashflow-views.md). Groups moved from `/tags` into saved Cashflow views.

# Groups (saved tag combinations)

## Goal
Let users see their money through **groups** in Cashflow. A group is a named combination of tags (e.g. "Mother Health Expenses" = `health` + `mother`). Tags stay simple and flat. Groups are views on top of them.

## The Model (agreed)
- **Tags** are simple and flat (`health`, `personal`, `mother`…). Any tags can go on an expense, with no rules.
- **Group** = a name + a list of tags. It matches expenses that have **all** of its tags.
- **Nesting is optional.** A group can sit under another group. A nested group **inherits its parent's tags**: under "Health" (`health`), "Mother Health Expenses" only lists `mother`, and matches `health` + `mother`.
- **Overlaps are allowed.** One expense can appear in several groups. Group totals are never summed into a grand total.
- **Check overlaps button:** lists expenses that appear in more than one group on screen, **ignoring parent/child pairs** (a child always overlaps its parent by design).
- **Deleting a tag used by a group:** warn first, listing the groups that use it.
- **Dimensions are removed.** They were a different idea (folders of tags with Single/Multiple selection) and are no longer used.

Example:

| Group | Own tags | Matches (incl. inherited) |
|---|---|---|
| Health Expenses | `health` | `health` |
| └ Personal Health | `personal` | `health` + `personal` |
| └ Mother Health Expenses | `mother` | `health` + `mother` |

## Tasks

### Task 1 - Remove dimensions from the frontend [x]
> Done. One temporary leftover: `tagsApi.createTag` still sends `dimension_id: null` (marked `TODO(remove-dimensions)`) so tag creation keeps working until the backend drops the field.
- Types, API, query keys, and `useTags`: drop dimension types, endpoints, and mutations.
- `tag-selection` utils: drop dimension grouping and the single-select rule. Keep search/sort/limit. Update tests.
- `TagPicker`: one flat, alphabetical list (no dimension headings or radio buttons).
- `/tags` screen (`TagsSettingsCard`): drop the dimensions section and the dimension select on tag creation.

### Task 2 - Backend: groups API (see "Backend Contract") [x]
- Owned by the backend session. The frontend work below starts once the endpoints exist.

### Task 3 - Groups management on `/tags` [x]
- List groups (nested under their parent), create/rename/delete, pick the group's tags (reuse `TagPicker`), optionally choose a parent.

### Task 4 - Groups in Cashflow [x]
- Show each group with its total and count, with nested groups indented under their parent. Flat or nested display.
- No "sum of groups" row.
- Clicking a group opens its transactions (existing `tag_ids` + `tag_match=all` filter, using the group's inherited tags).

### Task 5 - Check overlaps [x]
- Button in Cashflow that lists expenses shared by groups on screen, excluding parent/child pairs.

### Task 6 - Warn before deleting a tag used by a group [x]
- On `/tags`, deleting a tag that groups use shows a confirmation listing those groups.

## Implementation Notes
- **Frontend code:** types, `tag-groups.api.ts`, `TAG_GROUP_QUERY_KEYS`, and `use-tag-groups.ts` (list + create/update/delete, summary, overlaps) live in the `tags` domain. `tag-group-tree.ts` (+ tests) nests the flat list. `tag-group-errors.ts` maps API error codes to friendly messages.
- **`/tags`:** `TagGroupsCard` (nested list, create/edit dialog with optional parent, delete confirmation that mentions subgroups) sits above the tags list. Editing sends only the changed fields, so an inactive tag isn't resent.
- **Cashflow → Expenses:** `ExpensesByGroup` shows each group's total and count from `/tag-groups/summary` (all transactions), with a Nested/Flat toggle. There's no grand total. Each row links to `/transactions?tag_ids=<effective_tag_ids>&tag_match=all&movement_type=expense` for the same dates.
- **Check overlaps:** opens a dialog fed by `/tag-groups/overlaps` (only fetched when opened). The API lists only the most specific groups per transaction.
- **Deactivating a tag** that groups use asks for confirmation and lists those groups. Other tags deactivate immediately, as before.
- **`/transactions` fixes needed for drill-down:** the route now accepts `tag_ids` and `tag_match`, and the screen's on-mount default no longer wipes incoming filters (it used to keep only page/sort/dates).
- **Leftovers removed:** `dimension_id: null` in `createTag`, and the invalidation of the removed `/aggregations` queries.

## Backend Contract (proposal)
Groups live on the backend so they're saved per user and totals are computed over **all** transactions. The current Cashflow screen only loads 100.

**Resource:** `/tag-groups`
```jsonc
// GET /tag-groups → list (flat; the frontend nests by parent_id)
[
  {
    "id": "uuid",
    "name": "Mother Health Expenses",
    "parent_id": "uuid-of-Health" | null,
    "tag_ids": ["uuid-of-mother"],           // own tags only
    "effective_tag_ids": ["uuid-of-health", "uuid-of-mother"], // own + inherited (read-only)
    "display_order": 0,
    "created_at": "…",
    "updated_at": "…"
  }
]

// POST  /tag-groups        { "name": "…", "tag_ids": ["…"], "parent_id": "…" | null }
// PATCH /tag-groups/:id    any of name, tag_ids, parent_id, display_order
// DELETE /tag-groups/:id   deleting a parent also deletes its children
```

**Matching rule:** a transaction matches a group if it has **all** of the group's `effective_tag_ids`.

**Totals:**
```jsonc
// GET /tag-groups/summary?date_from=…&date_to=…&movement_type=expense
[ { "group_id": "uuid", "total": "1240.00", "count": 12 } ]
```

**Overlaps:**
```jsonc
// GET /tag-groups/overlaps?date_from=…&date_to=…&movement_type=expense
// Transactions matching 2+ groups, ignoring ancestor/descendant pairs
[ { "transaction_id": "uuid", "description": "Pharmacy", "amount": "100.00",
    "group_ids": ["uuid-a", "uuid-b"] } ]
```

**Validation:** `name` required. `tag_ids` must be the user's own tags (at least one). `parent_id` must be the user's own group, with no cycles.

**Dimensions removal:** see the message to the backend in the conversation (also summarized in Task 1).

## Expected Result
Users tag freely, define groups as tag combinations (optionally nested), and see per-group totals in Cashflow, with a one-click check for overlapping expenses.
