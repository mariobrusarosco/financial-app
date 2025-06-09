import type { ReactNode } from 'react';
import { Navigation } from './navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Desktop: Account for fixed sidebar */}
      <div className="md:pl-64">
        {/* Mobile: Account for fixed header */}
        <div className="pt-16 md:pt-0">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
