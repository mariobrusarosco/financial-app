# Path Aliases Guide

This guide explains how to use TypeScript path aliases in the Better Call Buffet project, focusing on our domain-based architecture.

## What Are Path Aliases?

Path aliases provide shortcuts for imports, allowing you to reference modules using predefined paths instead of relative paths. For example:

```typescript
// Without path aliases (relative import)
import { Button } from '../../../domains/global/components/button';

// With path aliases
import { Button } from '@global/components/button';
```

## Configured Path Aliases

Our project has the following path aliases configured in `tsconfig.json`:

| Alias        | Points to               | Purpose                                |
| ------------ | ----------------------- | -------------------------------------- |
| `@/*`        | `src/*`                 | Access anything in the src directory   |
| `@domains/*` | `src/domains/*`         | Access any domain                      |
| `@global/*`  | `src/domains/global/*`  | Access shared components and utilities |
| `@tools/*`   | `src/domains/tools/*`   | Access feature flags, analytics, etc.  |
| `@testing/*` | `src/domains/testing/*` | Access test utilities                  |

## Using Path Aliases

### Absolute Imports Only

- Always use absolute imports with the configured path aliases for application code.
- Do not use relative imports such as `./` or `../` when an alias-based import is possible.
- Do not use barrel imports such as folder-level `index.ts` or `index.tsx` exports.
- Prefer the most specific existing alias for the target path.
- If an import can be written with a configured alias, it must not be written as a relative path.
- Import from the actual implementation file, not from a folder export.

Examples:

```typescript
import { useInstallmentPlans } from '@/domains/installments/hooks/use-installment-plans';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';
import type { I_InstallmentPlan } from '@/domains/installments/types/types-and-interfaces';
```

Avoid:

```typescript
import { useInstallmentPlans } from '../hooks/use-installment-plans';
import { formatCurrencyAmount } from '../../global/utils/formatting';
import type { I_InstallmentPlan } from '../types/types-and-interfaces';
import { useUpcomingSubscriptions } from '@/domains/dashboard/hooks';
```

### Importing from the Global Domain

The global domain contains shared code used across the application.

```typescript
// Import a component from the global domain
import { Button } from '@global/components/button';

// Import a hook from the global domain
import { useTheme } from '@global/hooks/use-theme';

// Import a utility function
import { formatCurrency } from '@global/utils/format-currency';
```

### Importing from the Tools Domain

The tools domain contains cross-cutting infrastructure like feature flags.

```typescript
// Import feature flags
import { useFeatureFlag } from '@tools/feature-flags/use-feature-flag';

// Import analytics
import { trackEvent } from '@tools/analytics/track-event';
```

### Importing from a Specific Domain

You can access any domain using the `@domains` alias.

```typescript
// Import from the investments domain
import { AccountList } from '@domains/investments/components/account-list';
```

### Importing Types with Path Aliases

When importing types, use the `type` keyword as per our coding standards:

```typescript
// Import types with the type keyword
import type { AccountSummary } from '@domains/investments/schemas/account.schema';
```

## Path Aliases and Domain Structure

Our path aliases are designed to work with our domain-based architecture:

```
src/
├── domains/
│   ├── global/       # @global/*
│   ├── tools/        # @tools/*
│   ├── testing/      # @testing/*
│   ├── investments/  # @domains/investments/*
│   └── ...
```

Each domain maintains its own internal structure:

```
domain-name/
├── api/              # API clients and service interfaces
├── components/       # UI components specific to this domain
├── hooks/            # Custom React hooks
├── screens/          # Page components
├── state-management/ # State management
├── utils/            # Utility functions
└── index.ts          # Public exports
```

## Troubleshooting Path Aliases

### Path Aliases Not Working

If path aliases aren't working:

1. Check that `tsconfig.json` has the proper path configuration
2. Restart the TypeScript server in your IDE (VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server")
3. Make sure your build tool is configured to understand path aliases
4. Verify you're using the correct casing (aliases are case-sensitive)

### IDE Support

Most modern IDEs support TypeScript path aliases for auto-imports and navigation:

- **VS Code**: Built-in support with the TypeScript extension
- **WebStorm/IntelliJ IDEA**: Built-in support
- **Vim/NeoVim**: Requires additional plugins

### Examples of Common Imports

```typescript
// Components
import { Button } from '@global/components/button';
import { AccountCard } from '@domains/investments/components/account-card';

// Hooks
import { useLocalStorage } from '@global/hooks/use-local-storage';
import { useAccountData } from '@domains/investments/hooks/use-account-data';

// Utils
import { formatDate } from '@global/utils/format-date';

// Types
import type { ThemeMode } from '@global/schemas/theme.schema';
import type { AccountData } from '@domains/investments/schemas/account.schema';
```

## Best Practices

1. **Use the most specific alias possible** - Prefer `@global/components/button` over `@domains/global/components/button`
2. **Import from implementation files** - Do not import from folder-level `index.ts` or `index.tsx` files
3. **Always use the `type` keyword for type imports** - As per our coding standards
4. **Keep path structure consistent** - Maintain the same structure across domains
5. **Don't skip domains** - Import directly from a domain path, not from other domains
6. **Avoid relative imports in application code** - Prefer alias-based imports consistently
