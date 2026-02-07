import { UpcomingSubscriptions } from '../components/upcoming-subscriptions';

export const DashboardIndexScreen = () => {
  return (
    <div data-test-id="dashboard-index-screen" className="py-6">
      <div className="flex flex-wrap gap-x-8 gap-y-12">
        {/* <div className="spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
          <div className="spinner1" />
        </div> */}

        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
        <UpcomingSubscriptions />
      </div>
    </div>
  );
};

