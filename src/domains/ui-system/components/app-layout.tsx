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
    <div data-testid="app" className="bg-background pl-14 pt-8 h-full flex relative">
      <Navigation />

      <main data-ui="app-container" className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-end bg-section-background p-8">
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
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};
