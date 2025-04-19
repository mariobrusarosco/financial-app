import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function that wraps the component under test with any necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any custom options here, such as initial state
}

/**
 * All Provider wrapper
 */
function AllProviders({ children }: { children: ReactNode }) {
  // Add providers as needed (Router, Theme, Auth, etc.)
  return <>{children}</>;
}

/**
 * Custom render function that includes all providers
 */
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 