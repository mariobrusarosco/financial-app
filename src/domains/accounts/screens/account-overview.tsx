import { RecentTransactions } from '@/domains/accounts/components/recent-transactions';

interface AccountOverviewScreenProps {
  slug: string;
}

export const AccountOverviewScreen = ({ slug }: AccountOverviewScreenProps) => {
  return (
    <div className="space-y-6">
      <RecentTransactions accountId={slug} />
    </div>
  );
};
