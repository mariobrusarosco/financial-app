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
    <div data-testid="app" className="flex w-full h-full pt-8">
      <Navigation />

      <main data-ui="main-content" className="flex-1 flex flex-col h-full py-6 px-8 bg-section-background">
        <div className="flex justify-between items-end ">
          <div data-testid="user-greeting" className="flex flex-col items-start">
            <p className="text-xl font-light text-muted-foreground">Hello,</p>
            <p className="text uppercase text-primary">{user?.full_name || 'User'}</p>
          </div>

          <div className="flex items-center gap-2 text-primary">
            <span className="text-xl font-light tracking-widest uppercase">
              {format(today, 'EEEE - MMM d')}
            </span>
            <span className="text-xs">{format(today, 'yyyy')}</span>
          </div>

          <GlobalDateFilter />
        </div>

        <hr className="border-b border-primary/20 w-full my-6" />

        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};
