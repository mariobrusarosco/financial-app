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
