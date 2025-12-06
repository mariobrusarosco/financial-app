import type { ReactNode } from 'react';
import { Navigation } from './navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div data-ui="app" className="bg-background pt-10 h-full flex flex-col">
      <Navigation />

      <main data-ui="app-container" className="flex-1">
        {children}
      </main>
    </div>
  );
};
