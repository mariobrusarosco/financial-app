# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `yarn dev` - Start development server (http://localhost:5173)
- `yarn build` - Build for production
- `yarn start` - Start production server

### Code Quality

- `yarn typecheck` - Check TypeScript compilation without building
- `yarn lint` - Run ESLint linter
- `yarn lint:fix` - Auto-fix linting issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

### Testing

- `yarn test` - Run tests once
- `yarn test:watch` - Run tests in watch mode
- `yarn test:ui` - Run tests with UI interface
- `yarn test:coverage` - Run tests with coverage report

## Project Architecture

### Technology Stack

- **Framework**: TanStack Start (full-stack React framework)
- **Router**: TanStack Router with file-based routing
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Icons**: Lucide React v0.556.0
- **Styling**: Tailwind CSS v4
- **State Management**: React Query for server state, React Context for local state
- **API Client**: Axios with centralized configuration
- **Testing**: Vitest + Testing Library
- **Package Manager**: Yarn v3.8.7
- **Node Version**: 22.17.0

### Domain-Based Architecture

The codebase uses domain-based architecture organized in `src/domains/`:

#### Core Domains

- `accounts/` - Bank account management and transactions
- `credit-cards/` - Credit card management and invoices
- `broker/` - Investment broker management
- `transactions/` - Transaction processing and editing
- `dashboard/` - Main dashboard views
- `investments/` - Investment tracking (planned)

#### System Domains

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

### File Naming Conventions

- Use **kebab-case** for all files
- Components: `component-name.tsx`
- Hooks: `use-hook-name.ts`
- Types: `types-and-interfaces.ts`
- Always import types with `type` keyword: `import type { MyType } from './types'`

### API Type Naming Convention

For consistent API integration, follow this pattern:

**Single Resource:**

- `I_[Resource]Response` - Data FROM backend (GET /resource/:id)
- `I_[Resource]Payload` - Data TO backend (POST/PUT /resource)

**Collections:**

- `I_[Resources]Response` - Collection FROM backend (GET /resources)
- `I_[Resources]Payload` - Collection TO backend (bulk operations)

**Examples:**

- `I_TransactionResponse` - Single transaction from API
- `I_TransactionPayload` - Single transaction to API
- `I_TransactionsResponse` - Transaction list from API
- `I_TransactionsPayload` - Transaction list to API (bulk operations)

### Path Aliases (tsconfig.json)

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
- `docs/decisions/` - Architecture Decision Records (ADRs)
- `docs/decisions/coding-standards.md` - Detailed coding guidelines

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
