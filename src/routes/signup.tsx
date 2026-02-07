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
        <img src="/wb.png" alt="Better Call Buffet" className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary">Better Call Buffet</h1>
        <p className="text-muted-foreground mt-2">Start your financial journey today</p>
      </div>

      <SignupForm />
    </div>
  );
}
