# Cashflow Views

> Replaces [groups.md](./groups.md). Groups no longer live on `/tags`. They now live inside **views** in Cashflow.

## Goal
Let users look at the same expenses from different angles by saving **views** in Cashflow. A view arranges tags into named groups, e.g. one view groups by kind of expense, another by person.

## The Model (agreed)
```
View   (saved, named, set up in Cashflow)
 └─ Group   (just a name, which can match a tag name by coincidence)
     └─ Tag  (shows all expenses with that tag)
```
- **View:** created, renamed, and deleted in Cashflow, and persisted. A user can have many.
- **Group:** a name that holds tags. Its total counts each expense **once**, even if the expense has several of the group's tags ("any of its tags").
- **Tag inside a group:** shows all expenses with that tag, with its own total.
- **Fixed depth:** always view → groups → tags. No groups inside groups.
- **Overlaps are allowed:** an expense can appear under more than one group in a view. A **Check overlaps** button lists them, per view.
- **`/tags`** goes back to only managing tags. The groups section is removed.

Example (numbers are illustrative):
```
View "By kind"                    View "By person"
  Rent         $8000                Family       $4400
    family       $4000                rent         $4000
    personal     $4000                food         $400
  Food         $1000                Personal     $4900
                                      rent         $4000
                                      food         $500
```

## Defaults
- Views use Cashflow's date filter and show **expenses**.
- Groups and the tags inside them keep the order they were added in.
- Cashflow remembers the last opened view (per browser).
- Clicking a tag opens Transactions filtered by that tag. Clicking a group opens Transactions with **any** of its tags. Both use the same dates and expenses only.
- Deactivating a tag that a view uses asks for confirmation and names the views and groups.

## Tasks

### Task 1 - Plan (this doc) [x]

### Task 2 - Backend: views API (see "Backend Contract") [ ]
- Owned by the backend session. Also removes `/tag-groups`.

### Task 3 - Frontend: remove tag groups [x]
- Delete the groups card/dialog on `/tags`, the "By Group" card in Cashflow, and the tag-groups API, hooks, types, keys, utils, and tests.
- The tag-deactivation warning switches from groups to views.

### Task 4 - Frontend: views in Cashflow → Expenses [x] (verify once the backend ships)
- View switcher (tabs), plus New view and Edit/Delete for the current view.
- View editor dialog: view name, plus a list of groups (each with a name and tags), add/remove groups.
- View content: each group with its total and count, its tags listed below with their totals. Click-through to Transactions.
- Check overlaps for the current view.
- Built against the contract below. Verify once the backend ships.

## Implementation Notes
- **Code:** types in `cashflow/types/index.ts`, `cashflow/api/cashflow-views.api.ts`, `cashflow/api/keys.ts` (`CASHFLOW_VIEW_QUERY_KEYS`), `cashflow/hooks/use-cashflow-views.ts` (list + create/update/delete, summary, overlaps), `cashflow/utils/cashflow-views.ts` (+ tests).
- **UI:** `cashflow/components/views/cashflow-views-panel.tsx` (tabs, group and tag totals, edit/delete, overlaps) and `cashflow-view-dialog.tsx` (view name + groups editor). The panel replaced the "By Group" card in Cashflow → Expenses.
- **Editing** sends only what changed. `groups` is sent as the full list, and only if anything in it changed.
- **Last opened view** is stored in `localStorage` (`cashflow:last-view-id`), and falls back to the first view if unavailable.
- **Tag deactivation warning** on `/tags` now lists the views and groups that use the tag (`View › Group`).

## Backend Contract (proposal)
All endpoints are under `/api/v1`. Amounts are decimal strings (`"1240.00"`). Dates are inclusive and work the same as the transactions list. Ignored transactions are skipped, like the rest of Cashflow.

**Resource:** `/cashflow-views`
```jsonc
// GET /cashflow-views → the user's views, ordered by display_order, then name
[
  {
    "id": "uuid",
    "name": "By person",
    "display_order": 0,
    "groups": [
      { "id": "uuid", "name": "Family", "tag_ids": ["uuid-rent", "uuid-food"] }
    ],
    "created_at": "…",
    "updated_at": "…"
  }
]

// POST   /cashflow-views       { "name": "…", "groups": [{ "name": "…", "tag_ids": ["…"] }] } → 201, same shape
// PATCH  /cashflow-views/:id   any of name, display_order, groups → 200, same shape
//        `groups`, when sent, REPLACES the whole list (order = array order). Omitted fields are unchanged.
// DELETE /cashflow-views/:id   → 204
```

**Validation (422, with an `error.code` like today):** view name required. Each group needs a name and at least one tag. Tags must be the user's own and active. A tag can't appear twice in the **same** group, but **can** appear in different groups. Limits: 50 groups per view, 20 tags per group.

**Totals for one view:**
```jsonc
// GET /cashflow-views/:id/summary?date_from=…&date_to=…&movement_type=expense
{
  "groups": [
    {
      "group_id": "uuid",
      "total": "4400.00",   // distinct expenses with ANY of the group's tags (each counted once)
      "count": 7,
      "tags": [
        { "tag_id": "uuid-rent", "total": "4000.00", "count": 1 },  // all expenses with this tag
        { "tag_id": "uuid-food", "total": "400.00",  "count": 6 }
      ]
    }
  ]
}
```
Every group and tag of the view is included (zero matches come back as `"0.00"` / `0`). Totals cover all transactions, with no pagination.

**Overlaps for one view:**
```jsonc
// GET /cashflow-views/:id/overlaps?date_from=…&date_to=…&movement_type=expense
// Expenses that fall into 2+ groups of this view
[ { "transaction_id": "uuid", "description": "Pharmacy", "amount": "100.00",
    "date": "…", "group_ids": ["uuid-a", "uuid-b"] } ]
```

**Removal:** `/tag-groups` (all methods, plus `/summary` and `/overlaps`) and its tables.

## Expected Result
Users save several Cashflow views of their expenses, each arranging tags into named groups with totals. They can switch between views and check overlaps in one click. Tags stay simple and are managed on `/tags`.
