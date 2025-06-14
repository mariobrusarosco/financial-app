# TanStack Router Layouts Guide

## Overview

This guide covers how to implement layouts in TanStack Router, with a focus on pathless layouts which provide shared UI components across multiple routes without affecting URL structure.

## Table of Contents

- [Layout Types](#layout-types)
- [Pathless Layouts](#pathless-layouts)
- [Implementation in Our Project](#implementation-in-our-project)
- [Benefits](#benefits)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Layout Types

TanStack Router supports several types of layouts:

### 1. Regular Layout Routes

- Create URL path segments
- Nest child routes under the layout path
- Example: `dashboard.tsx` creates `/dashboard` path

### 2. Pathless Layout Routes

- **No URL path segments added**
- Wrap child routes with shared UI
- Use `_` prefix for files/folders
- Example: `_dashboard.tsx` provides layout without `/dashboard` path

### 3. Layout Route Groups

- Use `()` for organizational grouping
- Don't affect URL structure
- Example: `(auth)/` groups authenticated routes

## Pathless Layouts

### Purpose

Pathless layouts solve the common problem of wanting to share UI components across routes without forcing a hierarchical URL structure.

**Use Cases:**

- Shared navigation, headers, sidebars
- Common authentication wrappers
- Consistent styling across route groups
- Organizational benefits without URL impact

### File Structure Options

#### Option 1: Single File

```
routes/
├── _layout.tsx          // Pathless layout
├── _layout.dashboard.tsx // /dashboard
├── _layout.settings.tsx  // /settings
```

#### Option 2: Directory Structure (Recommended)

```
routes/
├── _layout/
│   ├── route.tsx        // Layout component
│   ├── dashboard.tsx    // /dashboard
│   ├── settings.tsx     // /settings
│   └── users.tsx        // /users
```

## Implementation in Our Project

### Our Structure

We implemented a pathless layout for all authenticated routes using the `(auth)` group directory:

```
routes/
├── (auth)/
│   ├── route.tsx              // 🎯 Pathless layout for all auth routes
│   ├── dashboard/index.tsx    // /dashboard
│   ├── accounts/index.tsx     // /accounts
│   ├── brokers/index.tsx      // /brokers
│   ├── settings/index.tsx     // /settings
│   └── accounts/$slug/        // Dynamic routes also inherit layout
│       ├── index.tsx          // /accounts/123
│       ├── credit-card/index.tsx // /accounts/123/credit-card
│       └── statements/index.tsx  // /accounts/123/statements
```

### Layout Component

```tsx
// app/routes/(auth)/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
```

### Child Route Example

```tsx
// app/routes/(auth)/dashboard/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/dashboard/')({
  component: DashboardComponent,
});

function DashboardComponent() {
  // No need to wrap with AppLayout - it's automatic!
  return (
    <div>
      <h1>Dashboard Content</h1>
      {/* Your dashboard content here */}
    </div>
  );
}
```

## Benefits

### 1. **DRY Principle**

- No duplicate layout code across routes
- Single source of truth for shared UI

### 2. **Clean URLs**

- `/dashboard` instead of `/auth/dashboard`
- Flexible URL design without sacrificing organization

### 3. **Automatic Inheritance**

- New routes automatically get the layout
- No need to remember to wrap components

### 4. **Easy Maintenance**

- Change layout once, affects all child routes
- Centralized styling and structure updates

### 5. **Type Safety**

- Full TypeScript support maintained
- Route params and search params work normally

## Best Practices

### 1. **Use Directory Structure**

```tsx
// ✅ Recommended
routes/
├── _authenticated/
│   ├── route.tsx
│   ├── dashboard.tsx
│   └── settings.tsx

// ❌ Avoid for complex layouts
routes/
├── _authenticated.tsx
├── _authenticated.dashboard.tsx
├── _authenticated.settings.tsx
```

### 2. **Keep Layout Components Simple**

```tsx
// ✅ Good - focused on layout structure
function AuthLayout() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// ❌ Avoid - too much business logic
function AuthLayout() {
  const [user, setUser] = useState()
  const [notifications, setNotifications] = useState()
  // ... lots of state management
  return (/* complex JSX */)
}
```

### 3. **Use Meaningful Names**

```tsx
// ✅ Clear purpose
routes/
├── _authenticated/
├── _dashboard/
├── _admin/

// ❌ Generic names
routes/
├── _layout1/
├── _wrapper/
├── _container/
```

### 4. **Leverage Route Groups**

```tsx
// ✅ Combine pathless layouts with route groups
routes/
├── (auth)/           // Route group (no URL impact)
│   ├── route.tsx     // Pathless layout
│   ├── dashboard.tsx
│   └── settings.tsx
├── (public)/         // Different group
│   ├── login.tsx
│   └── register.tsx
```

## Examples

### Authentication Layout

```tsx
// routes/(auth)/route.tsx
export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' });
    }
  },
});

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### Admin Dashboard Layout

```tsx
// routes/(admin)/route.tsx
export const Route = createFileRoute('/(admin)')({
  component: AdminLayout,
  beforeLoad: ({ context }) => {
    if (!context.user?.isAdmin) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-content">
        <AdminSidebar />
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
```

### Mobile-Responsive Layout

```tsx
// routes/_mobile/route.tsx
export const Route = createFileRoute('/_mobile')({
  component: MobileLayout,
});

function MobileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mobile-layout">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mobile-main">
        <Outlet />
      </main>
    </div>
  );
}
```

## URL Mapping Examples

With our `(auth)` pathless layout:

| URL Path                    | Rendered Components          |
| --------------------------- | ---------------------------- |
| `/dashboard`                | `<AppLayout><Dashboard>`     |
| `/accounts`                 | `<AppLayout><AccountIndex>`  |
| `/accounts/123`             | `<AppLayout><AccountDetail>` |
| `/accounts/123/credit-card` | `<AppLayout><CreditCard>`    |
| `/brokers`                  | `<AppLayout><BrokerIndex>`   |
| `/settings`                 | `<AppLayout><Settings>`      |

## Troubleshooting

### Common Issues

1. **Layout not applying to new routes**

   - Ensure the route file is inside the pathless layout directory
   - Check that the route path matches the expected pattern

2. **Duplicate layouts**

   - Remove manual layout wrappers from child components
   - Let the pathless layout handle all wrapping

3. **TypeScript errors**
   - Ensure `createFileRoute` path matches the actual file path
   - Use the Router CLI to auto-generate route paths

### Migration Tips

When converting existing routes to use pathless layouts:

1. Create the pathless layout route first
2. Remove layout wrappers from individual route components
3. Test each route to ensure layout is applied correctly
4. Update any route-specific styling that depended on the old structure

## Conclusion

Pathless layouts in TanStack Router provide an elegant solution for sharing UI across routes without URL complexity. They promote clean code organization, reduce duplication, and maintain flexibility in URL design.

The combination of pathless layouts with route groups (like our `(auth)` implementation) creates a powerful pattern for organizing complex applications while maintaining clean, intuitive URLs.
