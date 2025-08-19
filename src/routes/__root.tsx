import type { ReactNode } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import appCss from '@/domains/ui-system/styles/app.css?url';
import { ThemeProvider } from '@/domains/ui-system/components/theme-provider';
import { Toaster } from '@/domains/ui-system/components/sonner';
import { initSentry, SentryErrorBoundary } from '@/config/sentry';

const queryClient = new QueryClient();

// Initialize Sentry
initSentry();

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

function RootComponent() {
  return (
    <SentryErrorBoundary fallback={ErrorFallback} showDialog>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RootDocument>
            <Outlet />
            <Toaster />
          </RootDocument>
        </ThemeProvider>
      </QueryClientProvider>
    </SentryErrorBoundary>
  );
}


function ErrorFallback({ error }: { error: Error }) {
  return (
    <RootDocument>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="text-muted-foreground">
            We've been notified of the issue and are working to fix it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Reload page
          </button>
        </div>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
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
