# 🚨 Error Handling Guide for Better Call Buffet

## Overview

This guide covers the comprehensive error handling strategy for our financial application. We use a multi-layered approach to ensure users always know what's happening and how to resolve issues.

## 🎯 Error Handling Philosophy

For a financial application, error handling is critical for:

- **Trust**: Users need to know their money and data are safe
- **Transparency**: Clear communication about what went wrong
- **Recovery**: Provide actionable steps to resolve issues
- **Prevention**: Minimize errors through validation and good UX

## 🍞 Toast Notifications (Primary Method)

We use **Sonner** toasts for most error notifications. They're non-intrusive and provide immediate feedback.

### Setup

```typescript
// Already configured in __root.tsx
import { Toaster } from '@/domains/ui-system/components/sonner';

// In your component
<Toaster />
```

### Usage in Mutations

```typescript
import { handleErrorWithToast, FinancialErrorMessages } from '@/domains/global/utils/error-handler';

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: accountsApi.createAccount,
    onSuccess: newAccount => {
      toast.success('Account created successfully!', {
        description: `${newAccount.name} is ready to use`,
        duration: 4000,
      });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: FinancialErrorMessages.ACCOUNT_CREATION_FAILED,
      });
    },
  });
};
```

## 🎨 Error Severity Levels

### Low Severity

- **Color**: Blue (info)
- **Use Cases**: Data refresh failures, non-critical features
- **Duration**: 3 seconds
- **Example**: "Failed to load recent activity. Data may be outdated."

### Medium Severity

- **Color**: Orange (warning)
- **Use Cases**: Validation errors, user input issues
- **Duration**: 4 seconds
- **Example**: "Please check your input and try again."

### High/Critical Severity

- **Color**: Red (error)
- **Use Cases**: Payment failures, security issues, data corruption
- **Duration**: 6 seconds + retry button
- **Example**: "Transaction failed. Your account balance remains unchanged."

## 🔄 Error Categories & Handling

### 1. Network Errors

```typescript
// Automatic retry with exponential backoff
const retryHandler = createRetryHandler(apiCall, 3);

// User sees:
toast.error('Connection problem. Please check your internet and try again.', {
  action: {
    label: 'Retry',
    onClick: retryHandler,
  },
});
```

### 2. Validation Errors

```typescript
// Form validation
const { mutate, isError, error } = useCreateAccount();

// In component:
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Validation Error</AlertTitle>
    <AlertDescription>
      {error.message}
    </AlertDescription>
  </Alert>
)}
```

### 3. Authentication Errors (401)

```typescript
// Handled globally in API interceptor
if (status === 401) {
  toast.error('Your session has expired. Please log in again.');
  // Redirect to login
  navigate('/login');
}
```

### 4. Authorization Errors (403)

```typescript
toast.error("You don't have permission to perform this action.");
// No retry - user needs different permissions
```

### 5. Server Errors (500+)

```typescript
toast.error('Server error. Our team has been notified. Please try again later.', {
  duration: 6000,
  action: {
    label: 'Retry',
    onClick: () => window.location.reload(),
  },
});
```

## 🎯 Financial-Specific Error Messages

Use our predefined messages for consistency:

```typescript
import { FinancialErrorMessages } from '@/domains/global/utils/error-handler';

// Available messages:
FinancialErrorMessages.ACCOUNT_CREATION_FAILED;
FinancialErrorMessages.TRANSACTION_FAILED;
FinancialErrorMessages.BROKER_CONNECTION_FAILED;
FinancialErrorMessages.CREDIT_CARD_PARSE_FAILED;
FinancialErrorMessages.INSUFFICIENT_FUNDS;
FinancialErrorMessages.INVALID_AMOUNT;
FinancialErrorMessages.ACCOUNT_NOT_FOUND;
FinancialErrorMessages.DUPLICATE_TRANSACTION;
```

## 🧩 Integration with TanStack Query

### Query Error Handling

```typescript
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAccounts,
    retry: (failureCount, error) => {
      // Only retry on network errors
      return error instanceof NetworkError && failureCount < 3;
    },
    onError: error => {
      handleErrorWithToast(error, {
        severity: ErrorSeverity.LOW,
        userMessage: 'Failed to load accounts. Please refresh the page.',
      });
    },
  });
};
```

### Mutation Error Handling

```typescript
export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: accountsApi.updateAccount,
    onMutate: async variables => {
      // Optimistic updates with rollback on error
      await queryClient.cancelQueries(['accounts', variables.id]);
      const previousAccount = queryClient.getQueryData(['accounts', variables.id]);

      queryClient.setQueryData(['accounts', variables.id], variables);

      return { previousAccount };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousAccount) {
        queryClient.setQueryData(['accounts', variables.id], context.previousAccount);
      }

      handleErrorWithToast(error);
    },
    onSuccess: () => {
      toast.success('Account updated successfully!');
    },
  });
};
```

## 📱 UI Error States

### 1. Inline Form Errors

```typescript
// For field-level validation
{field.state.meta.errors.length > 0 && (
  <p className="text-sm text-destructive">
    {field.state.meta.errors.join(', ')}
  </p>
)}
```

### 2. Card/Section Errors

```typescript
// For section-level errors
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to load account data.
    <Button variant="link" onClick={refetch}>
      Try again
    </Button>
  </AlertDescription>
</Alert>
```

### 3. Page-Level Errors

```typescript
// For critical errors that affect the whole page
<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
  <AlertCircle className="h-12 w-12 text-destructive" />
  <div className="text-center">
    <h3 className="text-lg font-semibold">Something went wrong</h3>
    <p className="text-muted-foreground">
      We're having trouble loading this page.
    </p>
  </div>
  <Button onClick={() => window.location.reload()}>
    Refresh Page
  </Button>
</div>
```

## 🔍 Development vs Production

### Development Mode

- Full error details in console
- Stack traces visible
- Technical error messages shown

### Production Mode

- User-friendly messages only
- Errors logged to monitoring service
- Technical details hidden from users

```typescript
if (process.env.NODE_ENV === 'development') {
  console.error('Error Details:', {
    error,
    context: errorInfo,
    stack: error instanceof Error ? error.stack : undefined,
  });
}
```

## 📊 Error Monitoring & Analytics

Consider implementing:

- **Error Tracking**: Sentry, LogRocket, or similar
- **User Analytics**: Track error rates and user flows
- **Performance Monitoring**: Monitor API response times
- **Alert Systems**: Notify team of critical errors

## ✅ Best Practices

### DO ✅

- Use specific, actionable error messages
- Provide retry mechanisms for network errors
- Show success feedback after error recovery
- Test error scenarios thoroughly
- Use consistent error styling
- Log errors for debugging

### DON'T ❌

- Show technical errors to users
- Use generic "Something went wrong" messages
- Block the entire UI for minor errors
- Ignore errors silently
- Use alerts for non-critical issues
- Forget to handle loading states

## 🧪 Testing Error Scenarios

### Manual Testing

1. **Network Errors**: Disable internet, test offline behavior
2. **Server Errors**: Use network throttling, test timeouts
3. **Validation Errors**: Submit invalid forms
4. **Edge Cases**: Test with empty data, very large inputs

### Automated Testing

```typescript
// Test error handling in components
it('shows error toast when account creation fails', async () => {
  const mockError = new ApiError('Account creation failed', 400);
  jest.mocked(accountsApi.createAccount).mockRejectedValue(mockError);

  render(<CreateAccountForm />);

  fireEvent.click(screen.getByText('Create Account'));

  await waitFor(() => {
    expect(screen.getByText(/failed to create account/i)).toBeInTheDocument();
  });
});
```

## 🚀 Implementation Checklist

- [x] ✅ Sonner toast system installed and configured
- [x] ✅ Error handler utility created
- [x] ✅ API client error transformation
- [x] ✅ TanStack Query integration
- [ ] 🔄 Update all existing mutation hooks
- [ ] 🔄 Add error boundaries for React errors
- [ ] 🔄 Implement retry mechanisms
- [ ] 🔄 Add error monitoring service
- [ ] 🔄 Create error testing scenarios

## 🎓 Training for Team

1. **Review this guide** with all developers
2. **Practice scenarios** - simulate different error types
3. **Code reviews** - ensure error handling is consistent
4. **User testing** - validate error messages are clear
5. **Documentation updates** - keep this guide current

Remember: Good error handling is invisible when everything works, but crucial when things go wrong. In a financial app, it's the difference between user trust and user abandonment. 💰
