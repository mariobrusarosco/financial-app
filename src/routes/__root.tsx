import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import themeCss from '~/domains/ui-system/styles/theme.css?url'
import { seo } from '~/utils/seo'
import { Button } from '~/domains/ui-system'

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
      ...seo({
        title: 'Financial App | Manage Your Finances',
        description: `A modern financial web application for managing your investments and finances.`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: themeCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <header className="flex items-center justify-between py-4 mb-6 border-b">
            <div className="text-2xl font-bold text-primary">Financial App</div>
            <nav className="flex gap-4">
              <Link
                to="/"
                activeOptions={{ exact: true }}
              >
                {({ isActive }: { isActive: boolean }) => (
                  <Button variant={isActive ? "default" : "ghost"}>
                    Dashboard
                  </Button>
                )}
              </Link>

              <Link
                to="/investments"
              >
                {({ isActive }: { isActive: boolean }) => (
                  <Button variant={isActive ? "default" : "ghost"}>
                    Investments
                  </Button>
                )}
              </Link>
            </nav>
          </header>
          
          <main>
            {children}
          </main>
        </div>
        
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
