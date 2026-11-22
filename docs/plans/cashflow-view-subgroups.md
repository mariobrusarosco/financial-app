# Cashflow Views: Sub-groups and Any/All Matching

> Extends [cashflow-views.md](./cashflow-views.md). Views stay where they are (Cashflow → Expenses); their groups get sub-groups and a choice between matching **any** or **all** of their tags.

## Goal
Let a view describe spending the way people think about it, e.g. Home split into Bills and Maintenance, where Bills is rent **or** power **or** water. Today that can't be built:
- A group matches only the expenses that carry **all** of its tags, so "Bills" with `rent`, `power-bill`, `water-bill` matches nothing.
- Groups can't hold groups, so there's no Home above Bills and Maintenance.

## The Model (agreed)
```
View
 └─ Group        holds tags OR sub-groups
     └─ Sub-group   holds tags
```
- **Tags stay flat.** The structure lives in views, so each view can arrange the same tags differently (by kind, by person).
- **A group holds either tags or sub-groups, never both.** Expenses that fit none of a parent's sub-groups go in their own sub-group (e.g. "Other" with `home`).
- **A group with tags matches "any" or "all" of them.** "Any" (the default) is for categories like Bills. "All" is for combinations like Mother Health (`mother` + `health`).
- **A group with sub-groups** totals every expense in any of its sub-groups, counting each expense **once**, even if it falls in two of them.
- **Two levels only:** group → sub-group. Sub-groups can't hold sub-groups.
- **Overlaps are still allowed** between groups that hold tags (an expense tagged `rent` and `maintenance` shows in Bills and Maintenance). A parent and its own sub-groups never count as an overlap.

Example (numbers are illustrative):
```
View "Monthly"
  Home                                   R$ 5.200   (each expense once)
    Bills        any of: rent, power-bill, water-bill   R$ 4.300
    Maintenance  any of: maintenance, plumber           R$   900
  Health
    Mother       all of: mother, health                 R$   800
    Myself       all of: personal, health               R$   350
  Transportation any of: uber                           R$   600
  Not in any group                                      R$ 1.100
```

## Rules
- **Ungrouped** ("Not in any group") = expenses in range that match no group holding tags, anywhere in the view.
- **Overlaps** = expenses that match two or more groups holding tags. They're listed with each group's path (`Home › Bills`).
- **Sub-groups are always listed under their parent.** Clicking any row (parent, group, or sub-group) opens its expenses; a parent's are all its sub-groups' expenses, each once.
- **Open in Transactions** is offered for groups holding tags (with their any/all). Parents and "Not in any group" have no matching Transactions filter.
- **Order:** groups and sub-groups keep the order they were added in.
- **Existing groups** keep working exactly as today: they're migrated as top-level groups matching **all** of their tags (Mother Health, Myself, Transportation). New groups default to **any**.
- **Deactivating a tag** used by a view lists every place it's used, including sub-groups (`View › Group › Sub-group`).

## Tasks

### Task 1 - Plan (this doc) [x]

### Task 2 - Backend: sub-groups and any/all (see "Backend Contract") [x]
> Shipped in backend commit `443c109` (migration `33615cbf92fd`).
- Owned by the backend session.
- Migration: `cashflow_view_groups` gets `parent_id` and `match`; existing groups become `match = "all"`, `parent_id = null`.
- View CRUD, summary, overlaps, and group transactions follow the contract below.

### Task 3 - Frontend: types, API, and hooks [x]
- Nested `groups` on view and summary types; `match` on groups.
- `findViewGroupsUsingTag` and the overlaps dialog read nested groups and show paths. Update tests.

### Task 4 - Frontend: view editor [x]
> The Any/All switch shows once a group has two or more tags (with one tag they match the same expenses).
- Each group: a name, then either its tags with an **Any / All** switch, or its list of sub-groups (each with a name, tags, and the switch).
- **Add sub-group** on a group that holds tags moves those tags into the new sub-group, so nothing is lost. Removing the last sub-group turns the group back into one that holds tags.
- The dialog's description explains any/all and sub-groups.

### Task 5 - Frontend: Cashflow panel [x]
- Groups shown as a tree: a parent row with its total and count, its sub-groups indented below with theirs.
- Expanding any row shows its transactions, as today (a parent's are all its sub-groups' expenses).
- No sum of groups anywhere (groups can share expenses).

## Backend Contract (changes)
Everything not listed here stays as in [cashflow-views.md](./cashflow-views.md#backend-contract-proposal) and today's API under `/api/v1/cashflow/views`.

**View shape:** groups are nested, and every group has `match` and `groups`.
```jsonc
// GET /cashflow/views
[
  {
    "id": "uuid",
    "name": "Monthly",
    "display_order": 0,
    "groups": [
      {
        "id": "uuid-home",
        "name": "Home",
        "match": null,          // null: this group holds sub-groups
        "tag_ids": [],
        "groups": [
          { "id": "uuid-bills", "name": "Bills", "match": "any",
            "tag_ids": ["uuid-rent", "uuid-power-bill", "uuid-water-bill"], "groups": [] },
          { "id": "uuid-maintenance", "name": "Maintenance", "match": "any",
            "tag_ids": ["uuid-maintenance"], "groups": [] }
        ]
      },
      { "id": "uuid-transport", "name": "Transportation", "match": "any",
        "tag_ids": ["uuid-uber"], "groups": [] }
    ],
    "created_at": "…",
    "updated_at": "…"
  }
]

// POST  /cashflow/views       same shape without ids/timestamps
// PATCH /cashflow/views/:id   `groups`, when sent, still REPLACES the whole tree (order = array order)
```
- `match`: `"any"` or `"all"` on groups that hold tags (default `"any"` when omitted); `null` on groups that hold sub-groups.
- `groups` on a sub-group is always `[]`.

**Validation (422, with `error.code`):**
- A group needs tags **or** sub-groups, not both and not neither (`CASHFLOW_GROUP_NEEDS_TAGS_OR_SUBGROUPS`, `CASHFLOW_GROUP_TAGS_AND_SUBGROUPS`).
- A sub-group can't hold sub-groups (`CASHFLOW_GROUP_TOO_DEEP`).
- `match` must be `"any"` or `"all"` (`CASHFLOW_GROUP_INVALID_MATCH`).
- Existing rules stay: names required, tags owned and active, no duplicate tag in the same group, 20 tags per group. The 50-groups limit counts groups and sub-groups together.

**Matching:**
- `"any"`: expenses carrying at least one of the group's tags.
- `"all"`: expenses carrying every one of the group's tags (today's rule).
- Parent: expenses matching any of its sub-groups, each counted once.

**Summary:**
```jsonc
// GET /cashflow/views/:id/summary?date_from=…&date_to=…&movement_type=expense
{
  "groups": [
    {
      "group_id": "uuid-home",
      "total": "5200.00",   // distinct expenses across its sub-groups
      "count": 9,
      "groups": [
        { "group_id": "uuid-bills", "total": "4300.00", "count": 3, "groups": [] },
        { "group_id": "uuid-maintenance", "total": "900.00", "count": 6, "groups": [] }
      ]
    },
    { "group_id": "uuid-transport", "total": "600.00", "count": 14, "groups": [] }
  ],
  "ungrouped": { "total": "1100.00", "count": 21 }
}
```
Every group and sub-group is included, with `"0.00"` / `0` when nothing matches. A parent's total can be less than the sum of its sub-groups when they share expenses.

**Overlaps:** same response, but only groups that hold tags are compared, so `group_ids` never pairs a parent with its own sub-group.

**Group transactions:** `GET /cashflow/views/:id/groups/:group_id/transactions` accepts sub-group ids and parent ids (a parent lists its sub-groups' expenses, each once). `meta.total` still equals that group's `count` in the summary.

## Expected Result
A view can say "Home = Bills + Maintenance, and Bills = rent or power or water", with totals per group and sub-group, while combinations like Mother Health keep matching all of their tags. Existing views keep showing the same numbers after the migration.
