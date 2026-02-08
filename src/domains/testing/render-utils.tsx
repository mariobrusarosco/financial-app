import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRootRoute, createMemoryHistory } from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';
import { ReactNode } from 'react';

// Create a custom render function that includes providers
export function render(ui: ReactNode, { route = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
      },
    },
  });

  // Create a root route that renders the component
  const rootRoute = createRootRoute({
    component: () => <>{ui}</>,
  });

  // Create a new router instance for each test
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [route] }),
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
    queryClient,
    router,
  };
}

// Re-export everything from RTL
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
