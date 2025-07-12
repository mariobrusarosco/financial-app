import { RecentTransactions } from '@/domains/accounts/components/recent-transactions';

export const AccountOverviewScreen = () => {
  return (
    <div className="space-y-6">
      <RecentTransactions />
    </div>
  );
};
