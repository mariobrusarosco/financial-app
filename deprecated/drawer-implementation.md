# Drawer Implementation Guide

This guide explains how to implement drawer components using our global UI state management system with shadcn/ui Drawer and TanStack Router query parameters.

## Overview

Drawers are full-width bottom sheets that slide up from the bottom of the screen. They're perfect for forms, detail views, or any content that needs more space than a modal but shouldn't navigate to a new page.

## Prerequisites

### 1. Install shadcn Drawer Component

```bash
npx shadcn@latest add drawer
```

This creates `/src/domains/ui-system/components/drawer.tsx` with all necessary components.

### 2. Key Drawer Components

- `Drawer` - Root container
- `DrawerContent` - Main content area
- `DrawerHeader` - Header section
- `DrawerTitle` - Title component
- `DrawerTrigger` - Optional trigger button

## Implementation Steps

### Step 1: Create Domain-Specific Drawer Component

Create a drawer component within your domain that contains just the content (no `DrawerContent` wrapper).

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
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerTitle>Create New Account</DrawerTitle>
        <Button size="lg" form="account-create-form">
          Create Account
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateAccount />
      </div>
    </div>
  );
};
```

### Step 2: Register Your Drawer in Global System

Add your drawer type to the global drawer system by updating the lazy imports.

**File: `src/domains/global/components/global-drawer.tsx`**

```typescript
// Add your new drawer import
const CreateYourFeatureDrawer = lazy(() =>
  import('@/domains/your-domain/components/create-your-feature-drawer').then(module => ({
    default: module.CreateYourFeatureDrawer,
  }))
);

// Add to the mapping
if (drawerType === 'your-feature-create') {
  DrawerComponent = CreateYourFeatureDrawer;
}
```

### Step 3: Update Type Definitions

Add your drawer type to the route search params and hook.

**File: `src/routes/(auth)/route.tsx`**

```typescript
type AuthSearchParams = {
  drawer?: 'account-create' | 'broker-create' | 'your-feature-create';
};
```

**File: `src/domains/global/hooks/use-global-ui-state.ts`**

```typescript
const openYourFeatureCreate = () => navigate({ search: { drawer: 'your-feature-create' } });

return {
  // ... existing methods
  openYourFeatureCreate,
};
```

### Step 4: Use the Global Hook

Open your drawer from anywhere in the app using the global hook.

```typescript
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const YourComponent = () => {
  const { openYourFeatureCreate } = useGlobalUIState();

  return (
    <Button onClick={openYourFeatureCreate}>
      Create Feature
    </Button>
  );
};
```

## Key Patterns

### 1. Global State Management

```typescript
// Open drawer from anywhere
const { openAccountCreate } = useGlobalUIState();
openAccountCreate();

// Close drawer
const { closeUI } = useGlobalUIState();
closeUI();
```

### 2. URL-Based State

```typescript
// URLs control drawer state
/dashboard?drawer=account-create  // Opens account drawer
/brokers?drawer=broker-create     // Opens broker drawer
/dashboard                        // No drawer open
```

### 3. Lazy Loading with Smooth UX

```typescript
// Global drawer handles loading states
<Suspense fallback={
  <DrawerContent className="min-h-[80vh] flex items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </DrawerContent>
}>
  <DrawerComponent />
</Suspense>
```

### 4. Domain Component Structure

```typescript
// Domain drawer components contain only content
export const CreateAccountDrawer = () => {
  return (
    <div className="p-6 space-y-6 h-full">
      {/* Title and button row */}
      <div className="flex justify-between items-center">
        <DrawerTitle>Title</DrawerTitle>
        <Button form="form-id">Action</Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <YourFormComponent />
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Component Architecture

- Keep domain drawer components lightweight (content only)
- Don't include `DrawerContent` wrapper in domain components
- Let the global system handle the drawer shell and loading states

### 2. Loading States

- Global system provides smooth loading UX with proper drawer background
- No need to handle loading states in individual drawer components
- Lazy loading improves initial bundle size

### 3. State Management

- Use the global hook for consistent drawer operations
- URL-based state allows deep linking and browser back/forward
- Simple string-based drawer types are easier to maintain than complex objects

### 4. Form Integration

- Use HTML `form` attribute to link external buttons
- Keep submit button visible in header for better UX
- Handle navigation in mutation success callbacks

### 5. Accessibility

- shadcn Drawer includes proper ARIA attributes
- Focus management is handled automatically
- Escape key and click-outside work out of the box

## Example Usage

```typescript
// Open from any component
const { openAccountCreate, openBrokerCreate } = useGlobalUIState();

// URLs automatically work
/dashboard?drawer=account-create   // Opens account drawer
/brokers?drawer=broker-create      // Opens broker drawer
```

## Troubleshooting

### Drawer Shows Double Animation

- Ensure domain components don't include `DrawerContent` wrapper
- Let global system handle the single drawer container

### Button Not Submitting Form

- Ensure `form="form-id"` matches `<form id="form-id">`
- Check that form has proper `onSubmit` handler

### Lazy Import Errors

- Use `.then(module => ({ default: module.ComponentName }))` for named exports
- Ensure component is properly exported from its file

### Content Cut Off

- Add `overflow-y-auto` to content container
- Use `h-full` class in domain component root div

## Related Files

- `/src/domains/ui-system/components/drawer.tsx` - shadcn Drawer component
- `/src/domains/global/components/global-drawer.tsx` - Global drawer system
- `/src/domains/global/hooks/use-global-ui-state.ts` - Global UI state hook
- `/src/routes/(auth)/route.tsx` - Route with global drawer integration
- `/src/domains/accounts/components/create-account-drawer.tsx` - Example domain drawer
- `/src/domains/broker/components/create-broker-drawer.tsx` - Example domain drawer
