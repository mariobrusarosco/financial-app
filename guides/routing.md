# TanStack Router Redirects Guide

This guide explains how to implement redirects in TanStack Router within our Financial App.

## Overview

Redirects are a common need in web applications to:
- Guide users to the correct route
- Handle legacy URLs
- Implement authentication-based routing
- Create friendlier URL structures

TanStack Router provides built-in utilities for handling redirects effectively.

## Implementing Redirects

### Method 1: Using `beforeLoad` with `redirect`

The most common way to implement a redirect is using the `beforeLoad` hook with the `redirect` function:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/dashboard',
      replace: true
    })
  },
})
```

**How it works:**
1. Import `redirect` from `@tanstack/react-router`
2. Use `beforeLoad` to run code before the route loads
3. Throw the `redirect` function with configuration
   - `to`: The target route to redirect to
   - `replace`: When true, replaces the current history entry instead of adding a new one

**Key benefits:**
- Happens early in the routing lifecycle
- Prevents unnecessary component rendering
- Works on both client and server

### Method 2: Component-Based Redirect

You can also implement redirects in component render logic:

```tsx
import { Navigate } from '@tanstack/react-router'

export function RouteComponent() {
  return <Navigate to="/dashboard" replace />
}
```

**When to use:**
- When redirection depends on component state
- For conditional redirects based on props or hooks

### Method 3: Programmatic Redirects

For redirects triggered by events (like form submissions or button clicks):

```tsx
import { useNavigate } from '@tanstack/react-router'

function LoginComponent() {
  const navigate = useNavigate()
  
  const handleLogin = async (credentials) => {
    const success = await loginUser(credentials)
    
    if (success) {
      navigate({ to: '/dashboard' })
    }
  }
  
  return (
    // Login form
  )
}
```

## Common Redirect Patterns

### 1. Root Redirect (Our Implementation)

Redirecting the root path to a dashboard:

```tsx
// src/routes/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/dashboard',
      replace: true
    })
  },
})
```

### 2. Authentication Redirect

```tsx
export const Route = createFileRoute('/protected-page')({
  beforeLoad: ({ context }) => {
    // Check if user is authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          returnTo: '/protected-page'
        }
      })
    }
  },
})
```

### 3. Conditional Redirects

```tsx
export const Route = createFileRoute('/user-profile')({
  loader: async () => {
    const user = await fetchUserProfile()
    
    if (!user.hasCompletedSetup) {
      throw redirect({
        to: '/profile-setup',
      })
    }
    
    return user
  },
})
```

## Advanced Features

### Preserving Query Parameters

You can preserve query parameters when redirecting:

```tsx
throw redirect({
  to: '/dashboard',
  search: (prev) => ({
    ...prev,
    newParam: 'value'
  })
})
```

### Using Route Params in Redirects

You can use route parameters in your redirects:

```tsx
export const Route = createFileRoute('/old-product/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/products/$id',
      params: {
        id: params.id
      }
    })
  },
})
```

### Preserving Hash

You can also preserve the hash fragment when redirecting:

```tsx
throw redirect({
  to: '/dashboard',
  hash: 'section-2'
})
```

## Best Practices

1. **Use `beforeLoad` for Early Redirects**
   - Prevents unnecessary rendering and data loading

2. **Use `replace: true` for Navigation Replacements**
   - Especially for login/auth flows to keep history clean

3. **Prefer Declarative Redirects**
   - Use route configuration rather than imperative navigation when possible

4. **Handle Redirect Loops**
   - Be careful with circular redirects, which can cause infinite loops

5. **Consider Server-Side Rendering**
   - TanStack Router redirects work with SSR for better user experience

## Conclusion

Redirects in TanStack Router provide a powerful and flexible way to control application navigation flows. By using the patterns described in this guide, you can implement various redirect strategies in a clean, maintainable way. 