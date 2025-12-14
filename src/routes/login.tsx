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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="mb-8 text-center">
        <div className="flex gap-10 items-center justify-center">
          <div className="spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
            <div className="spinner1" />
          </div>
          <h1 className="text-7xl font-thin text-foreground">Better Call Buffet</h1>
        </div>
        <p className="text-muted-foreground mt-2 font-light">Personal finances management</p>
      </div>

      <LoginForm />
    </div>
  );
}
