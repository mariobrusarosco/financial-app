import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useLogin } from '../hooks/use-login';
import { Input } from '@/domains/ui-system/components/input';
import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Checkbox } from '@/domains/ui-system/components/checkbox';
import { Label } from '@/domains/ui-system/components/label';
import { Loader2 } from 'lucide-react';
import type { I_LoginRequest } from '../types/auth.types';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<I_LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      login(value);
    },
  });

  return (
    <div
      data-ui="login-form"
      className="grid place-content-center"
      style={{
        backgroundImage: `
        radial-gradient(at 100% -50%, #263a49 0px, transparent 60%),
        radial-gradient(at 40% 10%, #c9c9c9 0px, transparent 40%),
        radial-gradient(at 50% 1020%, #9e4963 0px, transparent 90%)
      `,
      }}
    >
      <form
        data-testid="login-form"
        onSubmit={e => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="w-100"
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

          <div className="text-sm bg-muted/50 border border-border/50 p-4 rounded-lg">
            <p className="font-medium mb-2 text-primary">Demo Credentials:</p>
            <div className="space-y-1 font-mono text-xs text-primary/70">
              <p>Email: user@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center mt-8">
          <Button
            data-testid="login-submit-button"
            type="submit"
            className="w-fit px-8 py-4"
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
