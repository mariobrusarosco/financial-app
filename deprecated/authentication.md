# Authentication Style Guide

This guide provides patterns and best practices for implementing authentication features in the Better Call Buffet application.

## Authentication Architecture

### Domain Structure

```
src/domains/auth/
├── api/
│   ├── index.ts           # Auth API functions
│   ├── keys.ts            # React Query keys
│   └── mock-data.ts       # Mock data for development
├── hooks/
│   ├── use-auth.ts        # Main auth hook
│   ├── use-login.ts       # Login mutation
│   ├── use-signup.ts      # Signup mutation
│   └── use-logout.ts      # Logout mutation
├── components/
│   ├── auth-guard.tsx     # Protected route wrapper
│   ├── login-form.tsx     # Login form
│   └── signup-form.tsx    # Signup form
├── types/
│   └── auth.types.ts      # Authentication interfaces
└── utils/
    ├── auth-storage.ts    # LocalStorage management
    └── token-manager.ts   # Token handling utilities
```

## Core Patterns

### 1. Authentication State Management

```typescript
// ✅ DO: Use centralized auth hook
const { user, isAuthenticated, isLoading } = useAuth();

// ❌ DON'T: Check localStorage directly in components
const token = localStorage.getItem('auth_token'); // Avoid this
```

### 2. Protected Routes

```typescript
// ✅ DO: Use AuthGuard for route protection
function AuthLayoutComponent() {
  return (
    <AuthGuard>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGuard>
  );
}

// ❌ DON'T: Check auth in every component
function SomeComponent() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />; // Avoid this pattern
}
```

### 3. Form Validation

```typescript
// ✅ DO: Use comprehensive validation with TanStack Form
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email';
      }
      return undefined;
    },
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Email</Label>
      <Input
        id={field.name}
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors.join(', ')}
        </p>
      )}
    </div>
  )}
</form.Field>
```

### 4. Mutation Handling

```typescript
// ✅ DO: Handle all mutation states
const { mutate: login, isPending, isError, error } = useLogin();

return (
  <Button
    type="submit"
    disabled={isPending || !form.state.canSubmit}
  >
    {isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Signing in...
      </>
    ) : (
      'Sign in'
    )}
  </Button>
);
```

## API Integration Patterns

### 1. Mock API Structure

```typescript
// ✅ DO: Structure mock APIs to mirror real backend
const login = async (credentials: I_LoginRequest): Promise<I_AuthResponse> => {
  await delay(500); // Simulate network delay

  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const tokens = generateMockTokens(user.id);
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    tokens,
  };
};
```

### 2. Token Management

```typescript
// ✅ DO: Use centralized token management
export class AuthStorage {
  static setTokens(tokens: I_AuthTokens, rememberMe = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    );
  }
}

// ❌ DON'T: Manage tokens manually in components
localStorage.setItem('token', token); // Avoid this
```

### 3. API Client Integration

```typescript
// ✅ DO: Add auth headers automatically
apiClient.interceptors.request.use(config => {
  const accessToken = AuthStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ DO: Handle auth errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      AuthStorage.clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
);
```

## Hook Patterns

### 1. Authentication Hook

```typescript
// ✅ DO: Provide comprehensive auth state
export const useAuth = () => {
  const { data: user, isLoading } = useQuery<I_User | null>({
    queryKey: GET_CURRENT_USER_QUERY_KEY(),
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isAuthenticated = !!user && TokenManager.hasValidToken();

  return {
    user,
    isAuthenticated,
    isLoading,
    refreshAuth,
    clearAuth,
  };
};
```

### 2. Mutation Hooks

```typescript
// ✅ DO: Include navigation and state updates
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<I_AuthResponse, Error, I_LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data, variables) => {
      AuthStorage.setTokens(data.tokens, variables.rememberMe);
      AuthStorage.setUser(data.user);
      queryClient.setQueryData(GET_CURRENT_USER_QUERY_KEY(), data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      void navigate({ to: '/dashboard' });
    },
    onError: error => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};
```

## UI Component Patterns

### 1. Form Layout

```typescript
// ✅ DO: Use consistent card layout for auth forms
<Card className="w-full max-w-md">
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
    <CardDescription>
      Enter your email and password to access your account
    </CardDescription>
  </CardHeader>

  <form onSubmit={handleSubmit}>
    <CardContent className="space-y-4">
      {/* Form fields */}
    </CardContent>

    <CardFooter className="flex flex-col space-y-4">
      <Button type="submit" className="w-full">
        Sign in
      </Button>
      <div className="text-sm text-center text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup">Sign up</Link>
      </div>
    </CardFooter>
  </form>
</Card>
```

### 2. Loading States

```typescript
// ✅ DO: Show appropriate loading states
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    </div>
  );
}
```

### 3. User Menu

```typescript
// ✅ DO: Include user info and logout functionality
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => logout()}>
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Security Patterns

### 1. Token Storage

```typescript
// ✅ DO: Use sessionStorage for non-persistent sessions
const storage = rememberMe ? localStorage : sessionStorage;

// ✅ DO: Clear all auth data on logout
static clearAuth(): void {
  Object.values(AUTH_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}
```

### 2. Route Protection

```typescript
// ✅ DO: Protect routes at layout level
export const Route = createFileRoute('/(auth)')({
  component: () => (
    <AuthGuard>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGuard>
  ),
});
```

### 3. Error Handling

```typescript
// ✅ DO: Handle auth errors gracefully
onError: error => {
  if (error.message.includes('expired')) {
    toast.error('Session expired. Please login again.');
  } else {
    toast.error(error.message || 'Authentication failed');
  }
};
```

## Type Safety

### 1. Interface Definitions

```typescript
// ✅ DO: Define comprehensive interfaces
export interface I_User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface I_AuthState {
  user: I_User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### 2. Form Types

```typescript
// ✅ DO: Use strict form types
export interface I_LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ✅ DO: Include validation requirements in types
export interface I_SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
```

## Testing Patterns

### 1. Hook Testing

```typescript
// ✅ DO: Test authentication hooks with React Query
describe('useAuth', () => {
  it('should return authenticated state when token exists', async () => {
    AuthStorage.setTokens(mockTokens);

    const { result } = renderHook(() => useAuth(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### 2. Component Testing

```typescript
// ✅ DO: Test form submission and validation
describe('LoginForm', () => {
  it('should show validation errors for invalid input', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });
});
```

## Migration Guidelines

### From No Auth to Full Auth

1. **Add auth domain structure**
2. **Wrap protected routes with AuthGuard**
3. **Update API client with auth headers**
4. **Add user menu to navigation**
5. **Create login/signup routes**
6. **Test authentication flow**

### Backend Integration

When integrating with real backend:

1. **Replace mock API with real endpoints**
2. **Update token validation logic**
3. **Add proper refresh token handling**
4. **Implement server-side session validation**

This style guide ensures consistent, secure, and maintainable authentication patterns throughout the application.
