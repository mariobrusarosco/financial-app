import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Surface } from '@/domains/global/components/surface';

interface AccountOverviewProps {
  slug: string;
}

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const { data: account } = useAccount(slug);

  return (
    <div data-ui="account-overview">
      <div className="grid grid-cols-3 gap-4">
        <Surface size="lg">
          <p>Balance</p>
          <p className="text-2xl font-bold text-green-500">
            {account?.currency} {account?.balance?.toLocaleString()}
          </p>
        </Surface>

        <Surface className="bg-green-500/50 text-primary-foreground hover:bg-green-500/80">
          <p>Earnings</p>
          <p className="text-2xl font-bold">0</p>
        </Surface>

        <Surface className="bg-primary/80 text-primary-foreground hover:bg-primary">
          <p>Spending</p>
          <p className="text-2xl font-bold">0</p>
        </Surface>
      </div>
    </div>
  );
};

export default AccountOverview;
