import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Surface } from '@/domains/global/components/surface';
import { Currency } from '@/domains/ui-system/components/currency';

interface AccountOverviewProps {
  slug: string;
}

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const { data: account } = useAccount(slug);

  return (
    <div data-ui="account-overview">
      <div className="grid grid-cols-3 gap-4">
        <Surface size="md">
          <p className="text-foreground text-sm">Balance</p>
          <Currency
            className="text-xl font-bold"
            variant="large"
            value={account?.balance}
            currency={account?.currency}
            autoColor
          />
        </Surface>

        <Surface size="md" className="">
          <p className="text-foreground text-sm">Earnings</p>
          <Currency className="text-xl font-bold" value={150} autoColor />
        </Surface>

        <Surface size="md" className="hover:bg-primary">
          <p className="text-foreground text-sm">Spending</p>
          <Currency
            className="text-foreground text-xl font-bold"
            value={0}
            currency={account?.currency}
          />
        </Surface>
      </div>
    </div>
  );
};

export default AccountOverview;
