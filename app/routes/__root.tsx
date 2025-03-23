import {
  Outlet,
  createRootRoute,
  Link,
  HeadContent,
  Scripts
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import '../index.css';
import { ClientOnly } from "../components/ClientOnly";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Better Call Buffet - Financial Wisdom",
      },
      {
        name: "description",
        content: "Take control of your finances with Better Call Buffet - track spending, manage budgets, and grow your investments with insights from Warren Buffett's wisdom.",
      },
      {
        name: "theme-color",
        content: "#0284c7",
      },
    ],
    link: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <ClientOnly>
        <Outlet />
      </ClientOnly>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
      <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
