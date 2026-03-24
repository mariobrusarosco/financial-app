import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as Sentry from '@sentry/react';
import appCss from '@/domains/ui-system/styles/app.css?url';
import { ThemeProvider } from '@/domains/ui-system/components/theme-provider';
import { Toaster } from '@/domains/ui-system/components/sonner';
import { BetaBanner } from '@/domains/ui-system/components/beta-banner';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { clearObservabilityUser, setObservabilityUser } from '@/config/observability';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Better Call Buffet',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

export function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RootDocument>
          <ObservabilityUserSync />
          <AppContent />
        </RootDocument>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      )}
    </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className="bg-red-100">
      <head>
        <HeadContent />
      </head>
      <body className="">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function AppContent() {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={scope => {
        scope.setTag('boundary', 'root');
        scope.setContext('route', {
          path: window.location.pathname,
        });
      }}
      fallback={() => <RootErrorFallback />}
    >
      <BetaBanner />
      <Outlet />
      <Toaster />
    </Sentry.ErrorBoundary>
  );
}

function ObservabilityUserSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setObservabilityUser({ id: user.id });
      return;
    }

    clearObservabilityUser();
  }, [user?.id]);

  return null;
}

function RootErrorFallback() {
  return (
    <div
      data-testid="root-error-fallback"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h1 className="text-2xl font-semibold text-primary">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We hit an unexpected error while rendering this page. Reload to try again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Reload page
      </button>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <RootDocument>
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">404 - Not Found</h1>
        <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </RootDocument>
  );
}
