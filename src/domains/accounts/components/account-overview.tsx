import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Surface } from '@/domains/global/components/surface';
import { Currency } from '@/domains/ui-system/components/currency';
import { Button } from '@/domains/ui-system/components/button';
import { RefreshCw } from 'lucide-react';
import { useAccountBalance } from '@/domains/accounts/hooks/use-account-balance';

interface AccountOverviewProps {
  slug: string;
}

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const { data: account } = useAccount(slug);
  const updateAccountBalance = useAccountBalance(slug);

  return (
    <div data-ui="account-overview" className="grid grid-cols-3 gap-4">
      <Surface size="md">
        <div className="flex items-center justify-between">
          <p className="text-foreground text-sm">Balance</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            disabled={updateAccountBalance.isPending}
            onClick={() => updateAccountBalance.mutate()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Currency
          className="text-xl font-bold"
          variant="large"
          value={account?.balance}
          currency={account?.currency}
          autoColor
        />
      </Surface>

      {/* <Surface size="md" className="">
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
        </Surface> */}
    </div>
  );
};

export default AccountOverview;
