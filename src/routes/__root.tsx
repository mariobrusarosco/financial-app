import type { ReactNode } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import appCss from '@/domains/ui-system/styles/app.css?url';
import { ThemeProvider } from '@/domains/ui-system/components/theme-provider';
import { Toaster } from '@/domains/ui-system/components/sonner';
import { BetaBanner } from '@/domains/ui-system/components/beta-banner';
import { initSentry } from '@/config/sentry';

const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RootDocument>
          <BetaBanner />
          <div className="pt-8">
            <Outlet />
          </div>
          <Toaster />
        </RootDocument>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
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
