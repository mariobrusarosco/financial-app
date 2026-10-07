# OffDeck-Inspired UI Refactor Plan

## Reference

The target visual specification is [Banking Dashboard UI by Mike Taylor for OffDeck](https://dribbble.com/shots/15455950-Banking-Dashboard-UI).

The reference will be treated as the primary design specification rather than loose inspiration. Its author describes it as a freebie that can be used for commercial and personal projects without attribution.

The implementation will reproduce its layout, visual hierarchy, spacing, palette, cards, navigation, and dashboard composition while replacing the example identity and financial content with real Financial App data.

## Implementation status

The full visual migration described below has been implemented in the current worktree:

- Shared colors, typography, elevation, controls, panels, dialogs, tables, and responsive states now use the OffDeck-inspired system.
- The authenticated shell now has a responsive labeled sidebar, mobile navigation, transaction search, user controls, and the existing global drawers.
- The dashboard is a real-data composition of active account balances, cashflow, scheduled subscriptions and installments, vendors, credit cards, and recent transactions.
- Accounts, account detail, credit cards, transactions, cashflow, subscriptions, installments, investments, vendors, brokers, settings, login, and signup have been migrated.
- Account deletion and transaction deletion retain their existing API integrations and now use consistent destructive confirmation surfaces.
- The production client and server bundle succeeds. Focused lint and TypeScript checks pass for the new shell, dashboard, account hook contract, transaction rows, authentication surfaces, and shared primitives.

The repository-wide lint and TypeScript commands still report pre-existing failures in legacy upload, form, chart-tooltip, and editable-table code. Those failures were recorded before the refactor and remain outside this visual migration. Authenticated browser QA is currently blocked by the local API returning `401` for the documented demo account; public authentication layouts and the production bundle were verified.

## Recommendation

Implement the redesign through staged, deployable slices instead of one large rewrite. Each phase must preserve existing financial behavior while progressively replacing the current visual system.

The recommended first implementation slice is the visual foundation, application shell, and dashboard. Once that direction is approved, the remaining screens can migrate onto the established system.

## Design Direction

The defining characteristics of the reference are:

- A light neutral application canvas.
- A persistent, labeled left navigation.
- Deep-indigo typography and hierarchy.
- One saturated blue brand color.
- Pastel solid-color action tiles.
- Thin, understated iconography.
- Restrained borders, radii, and shadows.
- Compact financial summaries with generous whitespace.
- A central workspace accompanied by contextual information on the right.
- Financial movements grouped by date with color-coded amounts.

## Product Mapping

| Reference element       | Financial App equivalent                                                        |
| ----------------------- | ------------------------------------------------------------------------------- |
| Labeled left navigation | Dashboard, Accounts, Transactions, Cashflow, Investments, Vendors, and Settings |
| Scheduled payments      | Upcoming subscriptions and installments                                         |
| Transfer shortcut tiles | New transaction, upload statement, new account, and new credit card             |
| Balance summary         | Sum of active account balances                                                  |
| Balance visualization   | Cashflow initially; aggregate balance history requires backend support          |
| Contacts                | Vendors and payees                                                              |
| Credit-card panel       | Credit cards returned by `useCreditCards(undefined)`                            |
| Grouped activity feed   | Recent transactions grouped by date                                             |
| Search bar              | Transaction-description search using `description_contains`                     |
| Profile controls        | Existing user menu and theme control                                            |

The implementation must not introduce dead controls or present cashflow as net-worth history. Exact aggregate balance history requires a dedicated backend contract.

## Design Tokens

### Colors

The initial palette will closely follow the reference:

| Purpose                        | Value     |
| ------------------------------ | --------- |
| Application canvas             | `#F8F9FA` |
| Primary text                   | `#060429` |
| Brand blue                     | `#1F4AE0` |
| Deep indigo                    | `#2B2865` |
| Muted text                     | `#BAC0CA` |
| Borders and secondary surfaces | `#B2B5CD` |
| Warm negative accent           | `#B46D64` |

Additional pastel action colors should be derived from semantic green, violet, peach, and cyan tokens rather than added as one-off component values.

Positive and negative financial values must remain understandable without depending only on color.

### Typography

- Replace Barlow Condensed with Inter.
- Use compact, medium-weight headings rather than oversized display typography.
- Use tabular numerals for balances and transaction values.
- Establish consistent title, section-heading, body, caption, and metadata styles.

### Shape and elevation

- Use a consistent spacing scale based on four-pixel increments.
- Prefer subtle one-pixel borders over heavy shadows.
- Use restrained radii across panels, controls, and list rows.
- Reserve stronger color blocks for primary actions, account cards, and financial-status indicators.

## Phase 0 — Baseline and visual contract

Before changing the application:

1. Record screenshots of the current desktop, tablet, and mobile application.
2. Record the existing build, lint, test, and typecheck results.
3. Document the new tokens and component states.
4. Define desktop, tablet, and mobile reference layouts.
5. Establish that each migration phase may introduce no new TypeScript, lint, or test failures.

The repository currently has pre-existing full-project TypeScript failures. These should be recorded as a baseline and handled separately unless they block a refactor slice.

## Phase 1 — Visual foundation

Refactor the shared visual system before individual screens.

### Work

- Replace the typography dependency and global font family.
- Introduce the reference palette through semantic CSS variables.
- Normalize background, foreground, card, border, muted, accent, destructive, and chart tokens.
- Update shared `Button`, `Card`, `Input`, `Tabs`, `Skeleton`, `Dialog`, `Select`, and `Textarea` styling.
- Consolidate the overlapping `Card`, `Surface`, and raw panel patterns.
- Standardize focus, hover, disabled, loading, error, and destructive states.
- Make the light theme canonical.
- Retain the existing theme infrastructure, but restore full dark-mode parity only after the light redesign is accepted.

### Primary files

- `src/domains/ui-system/styles/app.css`
- `src/domains/ui-system/components/button.tsx`
- `src/domains/ui-system/components/card.tsx`
- `src/domains/ui-system/components/input.tsx`
- `src/domains/ui-system/components/tabs.tsx`
- `src/domains/ui-system/components/dialog.tsx`
- `src/domains/global/components/page-header.tsx`
- `src/domains/global/components/surface.tsx`

### Completion criteria

- Shared primitives reproduce the reference’s visual language.
- Component states remain accessible and keyboard-visible.
- No screen-specific business behavior changes.
- Existing screens remain usable while migration is in progress.

## Phase 2 — Application shell

Rebuild the authenticated shell around the reference composition.

### Desktop

- Introduce an approximately 220-pixel labeled sidebar.
- Add brand identity at the top.
- Display primary navigation with icons and labels.
- Provide a clear active-route state.
- Place search, user avatar, theme control, and contextual actions in the top bar.
- Remove the global greeting and date from every page.
- Keep greetings and dashboard-specific summaries inside the dashboard domain.

### Tablet

- Collapse the sidebar to icons.
- Allow the contextual right rail to move below the primary content.
- Preserve visible labels through tooltips and accessible names.

### Mobile

- Continue using drawer navigation.
- Replace dense multi-column layouts with a single content stream.
- Keep primary actions reachable without fixed overlays obscuring content.

### Architecture

The application shell currently lives inside `ui-system` despite knowing about authentication and global application behavior. Move business-aware shell responsibility into the global domain while leaving purely visual primitives in `ui-system`.

Preserve:

- Authentication guards.
- Global drawers.
- Query providers.
- Error boundaries.
- Toast notifications.
- Beta status messaging.
- Existing route behavior.

### Primary files

- `src/domains/ui-system/components/app-layout.tsx`
- `src/domains/ui-system/components/navigation.tsx`
- `src/routes/(auth)/route.tsx`
- `src/domains/global/components/global-drawer.tsx`
- `src/domains/global/components/planner-cta.tsx`

## Phase 3 — Dashboard flagship screen

The dashboard will be the first complete vertical slice and the visual benchmark for later screens.

### Left region

- Primary navigation.
- Upcoming subscriptions.
- Upcoming installments.
- Compact scheduled-payment states.

### Center region

- User greeting.
- Quick-action tiles.
- Active-account balance total.
- Income and expense visualization.
- Vendors or frequently used payees.

### Right region

- Credit-card preview.
- Add-card action.
- Recent transactions grouped into Today, Yesterday, and older dates.
- Positive and negative values with both color and explicit signs.

### Data orchestration

Create one dashboard composition hook because this screen legitimately coordinates multiple domain resources and actions:

- Active accounts.
- Credit cards.
- Recent transactions.
- Upcoming subscriptions.
- Upcoming installments.
- Cashflow.
- Global create actions.

The hook must expose UI-ready resource contracts and keep sorting, grouping, and state derivation out of the screen component.

### Backend limitation

The existing cashflow implementation is calculated from at most 100 transactions and cannot accurately represent an unlimited financial history. The dashboard must label it as cashflow rather than net worth.

If exact historical balance parity with the reference is required, add a backend endpoint such as:

```text
GET /api/v1/dashboard/overview?from={date}&to={date}
```

Recommended response responsibilities:

- Current total balance.
- Historical aggregate balance points.
- Income total.
- Expense total.
- Recent activity.
- Upcoming scheduled obligations.

## Phase 4 — Core financial flows

Migrate the most-used routes after the dashboard establishes the new system.

### Accounts

- Replace grouped oversized account cards with compact reference-style financial cards.
- Preserve broker colors as secondary accents rather than primary card backgrounds.
- Keep account balance, institution, type, currency, and navigation visible.
- Redesign loading, empty, and error states with stable dimensions.

### Account detail

- Convert the account heading and balance area into a structured workspace header.
- Restyle account tabs as understated secondary navigation.
- Keep Overview, Statements, Expenses, Income, Credit Cards, and Settings behavior intact.
- Integrate account balance visualization into the central workspace.
- Preserve account creation, deletion, statement upload, and transaction creation.

### Transactions

- Adopt the reference’s compact activity-row structure.
- Group transactions by date where pagination allows.
- Preserve selection, bulk deletion, editing, ignore state, filters, and pagination.
- Replace native confirmation prompts with the shared confirmation dialog.
- Use explicit source, category, status, and signed amount hierarchy.

### Credit cards

- Create a reusable CSS-based card preview based on the reference.
- Use real names, last four digits, balances, limits, and brands.
- Preserve invoice upload, transaction, and invoice routes.

### Cashflow

- Restyle summaries and charts using the new palette and panels.
- Preserve date filtering and expense analysis.
- Clearly communicate incomplete data when the transaction limit affects accuracy.

## Phase 5 — Supporting domains

Apply the completed visual system to:

- Subscriptions.
- Installments.
- Investments.
- Vendors.
- Global settings.
- Account settings.
- Brokers.
- Login and signup.

These screens should reuse the established panels, headers, lists, charts, forms, dialogs, and states. They must not introduce independent visual systems.

## Phase 6 — Responsive and quality pass

### Responsive validation

- Desktop: 1440-pixel viewport.
- Tablet landscape: 1024-pixel viewport.
- Tablet portrait: 768-pixel viewport.
- Mobile: 390-pixel viewport.

### Accessibility

- Keyboard-operable navigation, tabs, menus, dialogs, and drawers.
- Visible focus states.
- WCAG AA contrast.
- Screen-reader labels for icon-only controls.
- Financial changes communicated with text or signs as well as color.
- Reduced-motion support for animated states.

### Testing

- Preserve existing unit and end-to-end behavior tests.
- Add screenshot-based Playwright coverage for the application shell, dashboard, accounts, account detail, and transactions.
- Exercise loading, error, empty, populated, and mutation-pending states.
- Verify drawer behavior and mobile navigation.
- Run build, targeted lint, formatting, tests, and the recorded TypeScript baseline on every slice.

### Cleanup

Only after every screen is migrated:

- Remove obsolete color tokens.
- Remove unused component variants.
- Remove legacy layout classes.
- Remove duplicate panel abstractions.
- Remove debug logging and commented-out UI paths encountered inside the migrated scope.

## Proposed pull-request sequence

1. **Design tokens and shared primitives**
2. **Authenticated shell and responsive navigation**
3. **Dashboard vertical slice**
4. **Accounts, account detail, and credit cards**
5. **Transactions and cashflow**
6. **Subscriptions, installments, investments, vendors, brokers, and settings**
7. **Authentication screens, responsive polish, accessibility, and visual regression tests**
8. **Legacy-style cleanup after migration completion**

Every pull request must remain deployable and must preserve existing route and API behavior.

## Definition of done

The refactor is complete when:

- Every active route uses the OffDeck-inspired visual system.
- The application shell matches the reference’s navigation and workspace hierarchy.
- No legacy screen-specific palette or panel system remains.
- Create, edit, delete, upload, filter, pagination, and navigation flows retain behavioral parity.
- Dashboard controls are backed by real actions and real data.
- There are no dead controls or fabricated financial values.
- Loading, error, empty, and success states occupy stable layouts.
- Desktop, tablet, and mobile layouts pass visual review.
- Keyboard navigation and contrast meet accessibility expectations.
- Build, lint, formatting, tests, and visual regression checks pass against the recorded baseline.

## Primary tradeoff

Closely reproducing the reference will make the application visually coherent and substantially more polished, but it requires replacing most screen-level presentation rather than merely changing global colors. The staged approach contains that risk and ensures business behavior remains independently verifiable throughout the migration.
