import type { ReactNode } from 'react';
import { Navigation } from './navigation';
import { GlobalDateFilter } from '@/domains/global/components';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { format } from 'date-fns';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();
  const today = new Date();

  return (
    <div data-testid="app" className="overflow-hidden h-screen md:flex">
      <Navigation />

      <main
        data-ui="main-content"
        className="flex-1 flex flex-col h-full pt-16 py-2 px-4 md:py-6 md:px-8 bg-section-background"
      >
        <div
          data-testid="layout-heading"
          className="mt-4 md:mt-6 flex gap-4 flex-wrap md:flex-col md:flex-row justify-between items-end"
        >
          <div data-testid="user-greeting" className="flex flex-col items-start">
            <p className="text-sm md:text-xl font-light text-muted-foreground">Hello,</p>
            <p className="text text-primary lg:text-3xl font-thin">{user?.full_name || 'User'}</p>
          </div>

          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm md:text-xl font-light tracking-widest uppercase">
              {format(today, 'EEEE - MMM d')}
            </span>
            <span className="text-xs">{format(today, 'yyyy')}</span>
          </div>

          <GlobalDateFilter />
        </div>

        <hr className="border-b border-primary/20 w-full my-3" />

        <div className="md:flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};
