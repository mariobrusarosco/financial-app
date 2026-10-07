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
      <div className="flex min-h-screen items-center justify-center bg-background pt-7">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div data-ui="login-screen" className="grid min-h-screen bg-card pt-7 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#2b2865] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-36 -right-24 h-96 w-96 rounded-full border-[72px] border-white/5" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg font-bold">
            B
          </span>
          <span className="text-sm font-semibold">Better Call Buffet</span>
        </div>
        <div className="relative max-w-xl">
          <p className="text-sm font-medium text-white/55">Personal finance, clearly organized.</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-balance">
            See where your money is going—and what comes next.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/65">
            Accounts, transactions, subscriptions, installments, investments, and cashflow in one
            focused workspace.
          </p>
        </div>
        <p className="relative text-xs text-white/40">Your data. Your decisions.</p>
      </section>

      <section className="flex items-center justify-center bg-background p-5 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-[var(--shadow-panel)] sm:p-8">
          <div className="mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-sm font-bold text-brand-foreground lg:hidden">
              B
            </span>
            <p className="mt-6 text-sm font-medium text-muted-foreground">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-foreground">
              Sign in to your account
            </h1>
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
