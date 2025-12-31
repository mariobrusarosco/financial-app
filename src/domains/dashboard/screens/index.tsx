import { useAuth } from '@/domains/auth/hooks/use-auth';
import { GaugeChart } from '@ui-system/components/gauge-chart';
import { GaugeChartSVG } from '@ui-system/components/gauge-chart-svg';
import { UpcomingSubscriptions } from '../components/upcoming-subscriptions';

export const DashboardIndexScreen = () => {
  const { user } = useAuth();

  // Format date as "Nov 29th, 2025"
  const formatDate = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });

    return {
      weekday,
      month,
      day,
      year,
    };
  };

  return (
    <div data-ui="dashboard-index-screen" className="h-full flex flex-col pt-20 relative overflow-auto">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        <div className="text-center">
          <h1 className="text-7xl font-thin">Hello, {user?.full_name || 'User'}</h1>
          <div className="flex flex-col items-center pt-6 text-muted-foreground font-thin tracking-widest uppercase">
            <span className="text-2xl">
              {formatDate().weekday} {formatDate().month} {formatDate().day}
            </span>
            <span className="text-md font-light">{formatDate().year}</span>
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
