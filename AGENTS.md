# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex) when working with code in this repository. Claude Code loads it through `CLAUDE.md`.

## Core Mandates

1 - **Understand the Code First:** Do not explain, refactor, or edit code based on pattern-matching alone. Before making changes, understand what the code does, why it exists, which business rule it implements, where the data comes from, and who consumes it. If you cannot explain the code path you are about to change, do not change it yet.
2 - **Strict Scope Adherence:** Do not fix unrelated bugs, refactor code, or change naming conventions outside the explicit scope of the user's request, even if you find errors. If you
discover critical issues that block the requested task, report them to the user and ask for permission before proceeding
3 - **Strict Scope Adherence:** Focus exclusively on the user's request. Do not fix unrelated bugs, refactor code, or change naming conventions unless explicitly asked. If a deviation
adds significant value or is critical, ask for permission first.
4 - **Think Before You Act Adherence:** DO NOT RUSH. Analyze the request, reason through the solution, and plan your steps. If a request is vague, ask for clarification. Only proceed with
implementation when the path is clear and agreed upon.
5 - **Verify Assumptions Adherence:** Never guess APIs or library functionality. Always read documentation or search for examples before writing code. "Sloppy solutions" based on assumptions are
strictly forbidden.
6 - **Context Awareness Adherence:** Understand the project's existing architecture and conventions before making changes. Your goal is to provide high-quality, integrated code that respects the
current codebase.

## Most Useful Commands

- `yarn dev` - Start development server (http://localhost:5173)
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn typecheck` - Check TypeScript compilation without building
- `yarn lint` - Run ESLint linter
- `yarn lint:fix` - Auto-fix linting issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn test` - Run tests once
- `yarn test:watch` - Run tests in watch mode
- `yarn test:ui` - Run tests with UI interface
- `yarn test:coverage` - Run tests with coverage report

## Technology Stack

- TanStack Start (full-stack React) with TanStack Router file-based routing
- shadcn/ui (Radix UI + Tailwind CSS v4), Lucide React icons
- React Query for server state, React Context for local state
- Axios with centralized configuration
- Vitest + Testing Library; Playwright for E2E

## Domain-Based Architecture

The codebase uses domain-based architecture organized in `src/domains/`:

### Core Domains

- `accounts/` - Bank accounts, their transactions, income/expenses, and linked credit cards
- `credit-cards/` - Credit cards, invoices, and statement upload/refinement
- `transactions/` - Transaction listing, editing, and bulk updates
- `cashflow/` - Cashflow screens and saved Cashflow views
- `installments/` - Installment plans and upcoming installments
- `subscriptions/` - Recurring subscriptions
- `tags/` - Transaction tags (replaced categories)
- `vendors/` - Vendor management
- `broker/` - Investment broker management
- `investments/` - Investment tracking and data input
- `dashboard/` - Main dashboard views
- `settings/` - Settings screen (profile, preferences, tags, vendors, data transfer)
- `data-transfer/` - Data export/import API, used from settings
- `auth/` - Login, registration, sessions, and token refresh
- `aggregations/` - Empty scaffold, no code yet

### System Domains

- `ui-system/` - All UI components, themes, and design system
- `global/` - Shared utilities, types, and error handling
- `testing/` - Test utilities and mock data

### Domain Structure

Each domain follows this pattern:

```
domain-name/
├── api/              # API services and keys
├── components/       # Domain-specific components
├── hooks/            # Custom React hooks
├── screens/          # Page components
├── types/            # TypeScript interfaces
├── utils/            # Domain utilities
└── index.ts          # Public exports
```

## Coding Style

- **File Imports**: Always use absolute imports with the `@/` prefix (see Aliases below).
- **File Naming**: All files use `kebab-case`. Hooks: `use-hook-name.ts`. Types: `types-and-interfaces.ts`.
- **Type Imports**: Always import types with the `type` keyword: `import type { MyType } from './types'`
- **Formatting**: The project uses Prettier for automatic code formatting.

### API Type Naming Convention

Also documented in `README.md`.

- `I_[Resource]Response` - Single resource FROM backend (GET /resource/:id)
- `I_[Resource]Payload` - Single resource TO backend (POST/PUT /resource)
- `I_[Resources]Response` - Collection FROM backend (GET /resources)
- `I_[Resources]Payload` - Collection TO backend (bulk operations)

Examples: `I_TransactionResponse`, `I_TransactionPayload`, `I_TransactionsResponse`, `I_TransactionsPayload`.

### Component and Hooks Creation

Refer to [Component Lifecycle](docs/style-guide/components-lifecycle.md) for more information.

### Canonical Sources

To avoid duplicated rules across files, use these as the single sources of truth:

- [Code Taste](docs/style-guide/code-taste.md) for tradeoff decisions
- [Component Lifecycle](docs/style-guide/components-lifecycle.md) for UI-hook responsibilities

#### Aliases (tsconfig.json)

- `@/*` → `src/*`
- `@domains/*` → `src/domains/*`
- `@ui-system/*` → `src/domains/ui-system/*`
- `@global/*` → `src/domains/global/*`

### API Integration Pattern

1. **Central API Client**: `src/config/api/index.ts` (Axios instance)
2. **Domain API Services**: `src/domains/{domain}/api/index.ts`
3. **React Query Hooks**: `src/domains/{domain}/hooks/use-{entity}.ts`
4. **Environment**: API base URL via `VITE_API_BASE_URL`

### Routing

- File-based routing in `src/routes/`
- TanStack Router generates `routeTree.gen.ts`
- Layout routes: `(auth)/route.tsx` for authenticated sections
- Dynamic routes: `$slug/` folders for parameters

### Key Files

- `src/router.tsx` - Router configuration
- `src/routes/__root.tsx` - Root layout with providers
- `src/domains/ui-system/` - Complete design system
- `docs/style-guide/` - Coding guidance and code taste

### Testing Strategy

- Vitest for unit/integration tests
- Testing Library for component testing
- Tests co-located with source files
- Shared test utilities in `src/domains/testing/`

### Environment Requirements

- Node.js 22.17.0 (for native fetch and ESM features)
- Yarn 3.8.7 (for workspace management)
- Uses `.env` files for environment variables

### Setup Instructions

When setting up this project for the first time:

1. **Enable Corepack** (one-time setup per machine):

   ```bash
   corepack enable
   ```

   This ensures all developers use the exact Yarn version specified in `package.json` (3.8.7), preventing lockfile conflicts on CI/CD platforms like Netlify.

2. **Install dependencies**:
   ```bash
   yarn install
   ```

### shadcn UI

Always use shadcn CLI to create shadcn UI components

### Icons and UI Conventions

#### Icon Library

This project uses **Lucide React** (v0.556.0) for all icons. Lucide is configured in `components.json` and integrates with shadcn/ui.

**Installation Pattern:**
Always use named imports from 'lucide-react':

```tsx
import { IconName, AnotherIcon } from 'lucide-react';
```

**Common Usage Patterns:**

1. **Static JSX rendering:**

   ```tsx
   import { Plus } from 'lucide-react';
   <Plus className="h-4 w-4" />;
   ```

2. **Component type reference (for dynamic rendering):**

   ```tsx
   const navigationItems = [{ icon: LayoutDashboard, label: 'Dashboard' }];
   const Icon = item.icon;
   <Icon className="h-5 w-5" />;
   ```

3. **React.createElement (for conditional icons):**
   ```tsx
   const TransactionIcon = isCredit ? CreditCard : Wallet;
   React.createElement(TransactionIcon, { className: 'h-3 w-3' });
   ```

**Standard Icon Sizes:**

- `h-3 w-3` - Small icons (12px)
- `h-4 w-4` - Standard buttons and controls (16px)
- `h-5 w-5` - Navigation items (20px)
- `h-6 w-6` - Larger UI elements (24px)

**Resources:**

- [Lucide Icon Library](https://lucide.dev)
- Icon search and browser at https://lucide.dev/icons
