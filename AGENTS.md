# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

## Domain-Based Architecture

The codebase uses domain-based architecture organized in `src/domains/`:

## System Domains

- `ui-system/` - All UI components, themes, and design system
- `global/` - Shared utilities, types, and error handling
- `testing/` - Test utilities and mock data

## Domain Structure

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

### Component and Hooks Creation

Refer to [Component Lifecycle](docs/style-guide/components-lifecycle.md) for more information.

### Canonical Sources

To avoid duplicated rules across files, use these as the single sources of truth:

- [Code Taste](docs/style-guide/code-taste.md) for tradeoff decisions
- [Path Aliases](docs/style-guide/path-aliases.md) for import rules
- [Coding Conventions](docs/style-guide/coding-conventions.md) for naming and API type conventions
- [Domain Architecture](docs/style-guide/domain-architecture.md) for domain structure
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
