import { useAuth } from '@/domains/auth/hooks/use-auth';
import { UpcomingSubscriptions } from '../components/upcoming-subscriptions';
import { format } from 'date-fns';

export const DashboardIndexScreen = () => {
  const { user } = useAuth();

  const today = new Date();

  return (
    <div data-ui="dashboard-index-screen" className="h-full flex flex-col pt-20 relative overflow-auto">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        <div className="text-center">
          <h1 className="text-7xl font-thin">Hello, {user?.full_name || 'User'}</h1>
          <div className="flex flex-col items-center pt-6 text-muted-foreground font-thin tracking-widest uppercase">
            <span className="text-2xl">
              {format(today, 'EEEE MMM d')}
            </span>
            <span className="text-md font-light">{format(today, 'yyyy')}</span>
          </div>
        </div>


        <div className="spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
          <div className="spinner1" />
        </div>

        <UpcomingSubscriptions />

      </div>
    </div>
  );
};
