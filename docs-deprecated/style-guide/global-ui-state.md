# Global UI State Management Guide

This guide explains how to implement and extend our global UI state management system for drawers, modals, and other UI components that need to be accessible from anywhere in the application.

## Overview

Our global UI state system uses TanStack Router's search parameters to manage UI state across the entire application. This approach provides:

- **URL-based state**: Deep linking support and browser history integration
- **Global accessibility**: Open UI components from any part of the app
- **Type safety**: Full TypeScript support with validated search parameters
- **Performance**: Lazy loading for better bundle size and loading states

## Architecture

### Core Components

1. **Global Hook** (`use-global-ui-state.ts`) - Provides convenient methods to control UI state
2. **Global Component** (`global-drawer.tsx`) - Handles rendering and lazy loading
3. **Route Integration** (`(auth)/route.tsx`) - Validates search params and renders global UI
4. **Domain Components** - Individual UI components exported from each domain

## Implementation

### 1. Route Setup

The authentication route handles global UI state validation and rendering.

**File: `src/routes/(auth)/route.tsx`**

```typescript
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';

type AuthSearchParams = {
  drawer?: 'account-create' | 'broker-create' | 'transaction-create';
  // Add more UI state types here:
  // modal?: 'settings' | 'help';
  // sidebar?: 'filters' | 'notifications';
};

export const Route = createFileRoute('/(auth)')(({
  component: AuthLayoutComponent,
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    const drawer = search.drawer;
    if (typeof drawer === 'string' &&
        ['account-create', 'broker-create', 'transaction-create'].includes(drawer)) {
      return { drawer: drawer as AuthSearchParams['drawer'] };
    }
    return {};
  },
});

function AuthLayoutComponent() {
  const { drawer } = Route.useSearch();

  return (
    <AppLayout>
      <Outlet />

      {/* Global UI State Management */}
      {drawer && <GlobalDrawer drawerType={drawer} />}

      {/* Future: Add other global UI components */}
      {/* {modal && <GlobalModal modalType={modal} />} */}
    </AppLayout>
  );
}
```

### 2. Global Hook

The hook provides a clean API for controlling global UI state.

**File: `src/domains/global/hooks/use-global-ui-state.ts`**

```typescript
import { useNavigate } from '@tanstack/react-router';

export const useGlobalUIState = () => {
  const navigate = useNavigate();

  const closeUI = () => {
    navigate({ search: {} });
  };

  // Drawer methods
  const openAccountCreate = () => navigate({ search: { drawer: 'account-create' } });
  const openBrokerCreate = () => navigate({ search: { drawer: 'broker-create' } });
  const openTransactionCreate = () => navigate({ search: { drawer: 'transaction-create' } });

  // Future: Add other UI methods
  // const openSettingsModal = () => navigate({ search: { modal: 'settings' }});
  // const openFiltersPanel = () => navigate({ search: { sidebar: 'filters' }});

  return {
    closeUI,
    openAccountCreate,
    openBrokerCreate,
    openTransactionCreate,
  };
};
```

### 3. Global Component

Handles lazy loading and rendering of UI components.

**File: `src/domains/global/components/global-drawer.tsx`**

```typescript
import { Suspense, lazy } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Drawer, DrawerContent } from '@ui-system/components/drawer';

// Lazy imports with named export transformation
const CreateAccountDrawer = lazy(() =>
  import('@/domains/accounts/components/create-account-drawer')
    .then(module => ({ default: module.CreateAccountDrawer }))
);

const CreateBrokerDrawer = lazy(() =>
  import('@/domains/broker/components/create-broker-drawer')
    .then(module => ({ default: module.CreateBrokerDrawer }))
);

interface GlobalDrawerProps {
  drawerType: 'account-create' | 'broker-create' | 'transaction-create';
}

export const GlobalDrawer = ({ drawerType }: GlobalDrawerProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  // Simple component mapping
  let DrawerComponent = null;

  if (drawerType === 'account-create') {
    DrawerComponent = CreateAccountDrawer;
  } else if (drawerType === 'broker-create') {
    DrawerComponent = CreateBrokerDrawer;
  }

  if (!DrawerComponent) {
    return null;
  }

  return (
    <Drawer open={true} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="min-h-[80vh]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        }>
          <DrawerComponent />
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
};
```

### 4. Domain Components

Domain components contain only the content, no wrapper elements.

**File: `src/domains/accounts/components/create-account-drawer.tsx`**

```typescript
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerTitle } from '@ui-system/components/drawer';
import CreateAccount from './create-account';

export const CreateAccountDrawer = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header with title and action */}
      <div className="flex justify-between items-center">
        <DrawerTitle>Create New Account</DrawerTitle>
        <Button size="lg" form="account-create-form">
          Create Account
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <CreateAccount />
      </div>
    </div>
  );
};
```

## Adding New UI Components

### Adding a New Drawer

1. **Create the domain component** (content only, no `DrawerContent`)
2. **Add lazy import** to global drawer component
3. **Update type definitions** in route and hook
4. **Add convenience method** to global hook

```typescript
// 1. Create domain component
export const CreateInvestmentDrawer = () => {
  return (
    <div className="p-6 space-y-6 h-full">
      {/* Your content */}
    </div>
  );
};

// 2. Add to global drawer
const CreateInvestmentDrawer = lazy(() =>
  import('@/domains/investments/components/create-investment-drawer')
    .then(module => ({ default: module.CreateInvestmentDrawer }))
);

// 3. Update types
type AuthSearchParams = {
  drawer?: 'account-create' | 'broker-create' | 'investment-create';
};

// 4. Add hook method
const openInvestmentCreate = () => navigate({ search: { drawer: 'investment-create' }});
```

### Adding Other UI Types (Modals, Sidebars)

```typescript
// 1. Update route types
type AuthSearchParams = {
  drawer?: 'account-create' | 'broker-create';
  modal?: 'settings' | 'help' | 'about';
  sidebar?: 'filters' | 'notifications';
};

// 2. Create global components
export const GlobalModal = ({ modalType }: { modalType: string }) => {
  // Similar lazy loading pattern
};

// 3. Add to route component
{modal && <GlobalModal modalType={modal} />}
{sidebar && <GlobalSidebar sidebarType={sidebar} />}

// 4. Add hook methods
const openSettingsModal = () => navigate({ search: { modal: 'settings' }});
const openFiltersPanel = () => navigate({ search: { sidebar: 'filters' }});
```

## Usage Examples

### Opening UI Components

```typescript
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const AnyComponent = () => {
  const {
    openAccountCreate,
    openBrokerCreate,
    closeUI
  } = useGlobalUIState();

  return (
    <div>
      <Button onClick={openAccountCreate}>
        Create Account
      </Button>
      <Button onClick={openBrokerCreate}>
        Create Broker
      </Button>
      <Button onClick={closeUI}>
        Close Any Open UI
      </Button>
    </div>
  );
};
```

### URL-Based Access

```typescript
// These URLs automatically open the corresponding UI:
/dashboard?drawer=account-create
/brokers?drawer=broker-create
/settings?modal=help

// Empty search params close all UI:
/dashboard
/brokers
```

### Programmatic Navigation

```typescript
// Navigate with UI state
navigate({
  to: '/dashboard',
  search: { drawer: 'account-create' },
});

// Navigate and clear UI state
navigate({
  to: '/brokers',
  search: {},
});
```

## Best Practices

### 1. State Management

- Keep UI state in URL for deep linking and browser history
- Use simple string-based identifiers, not complex objects
- Clear all search params to close UI components

### 2. Component Architecture

- Domain components should contain only content
- Let global system handle wrappers, loading states, and animations
- Use consistent naming patterns: `Create{Entity}Drawer`

### 3. Performance

- Lazy load all UI components for better bundle splitting
- Use proper Suspense fallbacks that match the UI structure
- Transform named exports for React.lazy compatibility

### 4. Type Safety

- Define all possible UI states in route search params
- Use union types for component type props
- Validate search params in route configuration

### 5. User Experience

- Provide smooth loading states with proper dimensions
- Handle close events consistently across all UI types
- Support keyboard shortcuts (escape key, etc.)

## Troubleshooting

### Double Animations

- Ensure domain components don't include wrapper elements
- Let global system handle single consistent wrapper

### Lazy Loading Errors

- Use `.then(module => ({ default: module.ComponentName }))` for named exports
- Verify component exports match import statements

### Type Errors

- Update all type definitions when adding new UI states
- Ensure search param validation covers all cases

### State Not Persisting

- Check that TanStack Router search param validation is working
- Verify navigation calls include proper search parameters

## Related Files

- `/src/routes/(auth)/route.tsx` - Main route with UI state validation
- `/src/domains/global/hooks/use-global-ui-state.ts` - Global state hook
- `/src/domains/global/components/global-drawer.tsx` - Global drawer component
- `/src/domains/accounts/components/create-account-drawer.tsx` - Example drawer
- `/src/domains/broker/components/create-broker-drawer.tsx` - Example drawer

## Future Enhancements

- Global modal system for dialogs and confirmations
- Sidebar/panel system for filters and secondary content
- Toast/notification management
- Loading overlay management
- Multi-step wizard/stepper UI components
