import type { ReactNode } from 'react';
import { Navigation } from './navigation';
import { GlobalDateFilter } from '@/domains/global/components';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div data-ui="app" className="bg-background pt-10 h-full flex">
      <Navigation />

      <main data-ui="app-container" className="flex-1 app-container flex flex-col min-h-0">
        <div className="px-8 py-4 flex justify-end">
          <GlobalDateFilter />
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};
