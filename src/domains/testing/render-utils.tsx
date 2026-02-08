import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
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

  // Basic router mock wrapper if needed, or just QueryClient
  // For unit tests, we often just need the QueryClientProvider
  // unless we are testing routing specifically.
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
    // return the queryClient in case tests need to interact with it
    queryClient,
  };
}

// Re-export everything from RTL
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
