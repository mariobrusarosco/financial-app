import type { ReactNode } from 'react';
import { Navigation } from '@/domains/ui-system/components/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    // From lg up the app sits as a rounded shell on the canvas backdrop (pt-11 = beta banner + gap)
    <div
      data-testid="app"
      className="flex h-screen overflow-hidden bg-background pt-7 lg:bg-canvas lg:p-4 lg:pt-11"
    >
      <div className="flex min-w-0 flex-1 overflow-hidden bg-background lg:rounded-[2rem]">
        <Navigation />

        <div className="flex min-w-0 flex-1 flex-col pt-16 md:pt-0">
          <main data-ui="main-content" className="min-h-0 flex-1 overflow-y-auto">
            <div className="app-container min-h-full p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
