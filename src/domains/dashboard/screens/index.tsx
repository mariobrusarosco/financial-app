import { useAuth } from '@/domains/auth/hooks/use-auth';
import { UpcomingSubscriptions } from '../components/upcoming-subscriptions';
import { format } from 'date-fns';

export const DashboardIndexScreen = () => {
  return (
    <div data-test-id="dashboard-index-screen" className="app-container bg-section-background h-full flex flex-col relative overflow-auto">
      <div className="flex mt-10">
        {/* <div className="spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
          <div className="spinner1" />
        </div> */}

        <UpcomingSubscriptions />
      </div>
    </div>
  );
};

