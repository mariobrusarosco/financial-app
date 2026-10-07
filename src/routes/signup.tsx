import { createFileRoute, Navigate } from '@tanstack/react-router';
import { SignupForm } from '@/domains/auth/components/signup-form';
import { useAuth } from '@/domains/auth/hooks/use-auth';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});

function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-7">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-14 pt-20">
      <div className="w-full max-w-md">
        <div className="mb-7">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg font-bold text-brand-foreground">
            B
          </span>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Get started</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-foreground">
            Build a clearer financial picture
          </h1>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
