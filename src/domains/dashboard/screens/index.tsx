import { UpcomingInstallments } from '../components/upcoming-installments';
import { UpcomingSubscriptions } from '../components/upcoming-subscriptions';

export const DashboardIndexScreen = () => {
  return (
    <div
      data-test-id="dashboard-index-screen"
      className="flex flex-wrap gap-x-8 gap-y-12 py-6 pr-6"
    >
      <UpcomingSubscriptions />
      <UpcomingInstallments />
    </div>
  );
};
