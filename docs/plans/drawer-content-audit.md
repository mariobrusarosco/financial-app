# Drawer content audit

Each drawer's form was read alongside its submit hook and the matching backend schema
(`better-call-buffet/app/domains/*/schemas.py`), then reviewed in the browser. The shared shell
(header, body, side column, footer) is already done; this covers what's inside.

## Summary

| Drawer | Works? | Main problem |
| --- | --- | --- |
| New credit card | **No** | `account_id` is collected but never sent; the API requires it (422) |
| New subscription / Edit subscription | **Partly** | Billing cycles don't match the API; required Account isn't stored; End date and Notes are dropped |
| New investment / Add investment data | **No** | They POST to `/investments`, `/investments/movements`, `/investments/balances`, which the API doesn't have |
| New account | Yes, with gaps | Broker is required by the API but not validated; a background refetch can wipe the form |
| New broker | Yes | Two black color pickers with no explanation; only the first color is ever used |
| New installment plan | Yes | Read-only "Total amount" field duplicates the preview; tags supported by the API but not offered |
| Installment plan (edit) | Yes | Only name and vendor are editable; the API also allows notes, tags, card and status |
| Vendor (new / edit) | Yes | Minor: URL fields reject `nike.com`; no logo preview |
| Link payment (installment) | Yes | — |
| Mark as paid (subscription) | Yes | Different selection pattern from the installment link-payment drawer |
| Transactions (new / edit) | Yes | Done in the previous rounds |

## Shared conventions to apply everywhere

1. **Labels:** sentence case, no trailing colons. "Optional" as a muted suffix, written the same way everywhere.
2. **Layout:** one or two columns, with every control full width. Selects shouldn't shrink to their content.
3. **Money:** one currency-prefixed amount input (as in the transaction form) instead of bare `type="number"` fields that show `0`.
4. **Dates:** the app's date picker, reading and writing local `yyyy-MM-dd`, instead of native date inputs.
5. **Validation mirrors the API:** required fields, ranges and "not in the future" are checked in the form, not discovered as a 422.
6. **Readable options:** selects show labels, never raw enum values like `cash` or `investment`.
7. **Optional fields** are grouped in a collapsible "Optional" section, like the transaction form.

## Per drawer

### New credit card — bug

- **What it does:** creates a card that belongs to a bank account. The API needs `account_id`, `name`, `brand`, `last_four_digits` and `due_date`, plus an optional `credit_limit`.
- **Problems:**
  - `account_id` is validated in the form but left out of the request, so creation fails.
  - The account for the success redirect is read once at render, so it's empty.
  - `CreateCreditCardDrawer` accepts `accountId`, but `GlobalDrawer` never passes it, so opening from an account page doesn't preselect that account.
  - The account list includes investment accounts and shows raw types.
  - The limit defaults to `0` but must be greater than 0, while the API defaults to 0.
  - The due day is a free number input, although a `DUE_DATE_OPTIONS` constant exists and isn't used.
- **Proposal:**
  - Send `account_id`.
  - Prefill the account from the route.
  - List only cash and savings accounts, with readable type labels.
  - Use a "Day 1–31" select for the due day.
  - Use the money input for the limit, and make it optional.
- **Decision needed:** the API stores `due_date` as a **date-time** while the UI treats it as a **day of the month**. Which is the real rule?

### New / Edit subscription — partly broken

- **What it does:** tracks a recurring payment. The API takes name, amount, billing cycle (`weekly | monthly | quarterly | yearly`), next due date, and optionally vendor and tags, plus `is_active`.
- **Problems:**
  - The form offers `daily | weekly | monthly | annually`: "daily" and "annually" are rejected, and "quarterly" can't be picked.
  - It requires Vendor, which the API treats as optional.
  - It requires Account, which the API doesn't store.
  - End date and Notes aren't API fields, so they're silently dropped, and editing always shows them empty.
  - Three cramped columns, an "Is active" checkbox mixed in with the selects, the amount shows `0`, and the vendor select is truncated.
- **Proposal:**
  - Fields: name; amount (money input); billing cycle as a 4-option segmented control matching the API; next due date (picker); vendor (optional); tags (optional).
  - "Active" becomes a switch, shown only when editing.
  - Remove Account, End date and Notes from the form, unless you want them added to the API.
- **Decision needed:** remove those three fields, or add them to the backend?

### New investment / Add investment data — broken

- **What they do:** create an "investment" and record movements or balances for it.
- **Problem:** the backend's investments router only has `GET /investments` and `GET /investments/balances`, so every submit fails. Investments now seem to be accounts of type `investment` plus balance points (the Data Input tab).
- **Proposal:** remove both drawers and the "Add investment" and "Add data" buttons on the Portfolio Overview tab. Replace them with:
  - "New investment account": the account drawer with the type preset to `investment`;
  - "Add data": a link to the Data Input tab.
- **Decision needed:** is that the current model? If so, removal is safe. Otherwise, which API should these use?

### New account (your work in progress — after it lands)

- **What it does:** creates an account under a broker, with a type, a currency, and an opening balance on an opening date. The API requires `broker_id`, rejects `balance < 0` and rejects `opening_date` in the future.
- **Problems:**
  - The broker isn't validated, so a missing broker fails as a 422.
  - Future dates are allowed.
  - `if (isFetching)` swaps the whole form for "Loading..." on every background refetch (window focus, for example), throwing away what the user typed. The transaction form had the same issue and uses `isPending`.
  - The "Credit Card" account type sits next to the separate credit card entity, which is confusing, and the API's `other` type isn't offered.
  - A three-column grid with content-width selects, a bare number field for the balance, and a native date input.
- **Proposal:**
  - Two groups: *Account* (name, type, broker) and *Starting point* (balance with a currency prefix, currency, and opening date through the picker, capped at today).
  - Description as an optional textarea.
  - Validate the broker, and use `isPending` for the loading state.
- **Decision needed:** keep the `credit` account type, and add `other`?

### New broker

- **What it does:** a bank or institution. The API requires `name` and `colors`; `logo` and `description` are optional.
- **Problems:**
  - Both colors default to `#000000`.
  - Nothing says what the colors are for. Only `colors[0]` is ever displayed: the stripe on account and broker cards.
  - The logo URL has no preview.
- **Proposal:**
  - One "Brand color" picker with a live account-card stripe preview. Keep sending two colors, the second derived from the first, until the API changes.
  - A logo URL field with a preview.
  - Description as an optional textarea.

### New installment plan

- **What it works out:** the API takes `total_amount` and `installment_count` and generates the installments; it also accepts tags.
- **Problems:**
  - A read-only "Total amount" field that looks editable and repeats the preview.
  - A "Show Calculator" link styled like a checkbox.
  - No tags field.
  - No way to clear the credit card selection.
- **Proposal:**
  - Amount as a money input with a calculator icon inside it (like transactions), plus a small "Per installment / Total" switch so people can enter whichever they know.
  - Remove the read-only total field.
  - Add tags, and a "None" option for the card.

### Installment plan (edit)

- **What it does:** shows progress, links payments, and lets you rename the plan and change its vendor inline.
- **Gap:** the API also allows editing notes, tags, credit card and status.
- **Proposal:** make those editable inline in the summary column, the same way the vendor is. This adds a feature, so it's your call.

### Vendor (new / edit)

- **Problems:**
  - The URL fields reject addresses without `https://`.
  - Errors appear on every keystroke.
  - No logo preview.
- **Proposal:**
  - Add `https://` automatically when it's missing.
  - Validate on blur.
  - Show a logo preview next to the name.

### Mark as paid (subscription) vs. Link payment (installment)

- **Problem:** both pick an unpaid transaction to link, but in different ways. The subscription version uses a ring highlight with a check icon; the installment version uses a radio list, a "near due date" filter and a footer summary of what will happen.
- **Proposal:** reuse the installment pattern for subscriptions.

## Suggested order

1. **Bugs:** credit card `account_id`; subscription billing cycles and fields; investment drawers (once decided).
2. **Shared form conventions:** labels, widths, money and date inputs, applied drawer by drawer.
3. **Content improvements:** broker colors, the installment amount mode, vendor URLs.
4. **Optional features:** inline editing of installment plans, and aligning subscription "Mark as paid" with the installment link-payment pattern.
