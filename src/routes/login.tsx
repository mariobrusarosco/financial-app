import { createFileRoute, Navigate } from '@tanstack/react-router';
import { LoginForm } from '@/domains/auth/components/login-form';
import { useAuth } from '@/domains/auth/hooks/use-auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div data-ui="login-screen" className="min-h-screen grid grid-cols-2">
      <div className="grid place-content-center">
        <div className="flex items-center justify-center">
          <h1 className="text-7xl max-w-md text-balance font-sans font-thin">Better Call Buffet</h1>
          <div className="spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
            <div className="spinner1" />
          </div>
        </div>
        <p className="mt-2 text-muted-foreground text-2xl font-light">
          Personal finances management
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
