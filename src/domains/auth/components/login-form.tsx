import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useLogin } from '@/domains/auth/hooks/use-login';
import { Input } from '@/domains/ui-system/components/input';
import { Button } from '@/domains/ui-system/components/button';
import { Checkbox } from '@/domains/ui-system/components/checkbox';
import { Label } from '@/domains/ui-system/components/label';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import type { I_LoginRequest } from '@/domains/auth/types/auth.types';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: ({ value }) => {
      login(value as I_LoginRequest);
    },
  });

  return (
    <div data-ui="login-form">
      <form
        data-testid="login-form"
        onSubmit={e => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="w-full"
      >
        <div className="space-y-4">
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
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-primary">
                  Email
                </Label>
                <Input
                  data-testid="login-email-input"
                  id={field.name}
                  type="email"
                  placeholder="user@example.com"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={isPending}
                  autoComplete="email"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return undefined;
              },
            }}
          >
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-primary">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    data-testid="login-password-input"
                    id={field.name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isPending}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="rememberMe">
            {field => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.state.value}
                  onCheckedChange={checked => field.handleChange(!!checked)}
                  disabled={isPending}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer text-primary"
                >
                  Remember me
                </Label>
              </div>
            )}
          </form.Field>

          <div className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm">
            <p className="mb-2 font-medium text-foreground">Demo credentials</p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>Email: user@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-3">
          <Button
            data-testid="login-submit-button"
            type="submit"
            className="w-full"
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

          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
