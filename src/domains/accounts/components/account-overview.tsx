import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Surface } from '@/domains/global/components/surface';
import { Currency } from '@/domains/ui-system/components/currency';
import { Button } from '@/domains/ui-system/components/button';
import { RefreshCw } from 'lucide-react';
import { useAccountBalance } from '@/domains/accounts/hooks/use-account-balance';
import { GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY, GET_ACCOUNT_QUERY_KEY } from '../api/keys';
import { useQueryClient } from '@tanstack/react-query';
import { useAccountBalancePoints } from '../hooks/use-account-balance-points';
import { Route } from '@/routes/(auth)/route';
import { useMemo } from 'react';

interface AccountOverviewProps {
  slug: string;
}

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const queryClient = useQueryClient();
  const { data: account } = useAccount(slug);
  const { from, to } = Route.useSearch();
  const { isPending: isLoadingBalancePoints, data: balancePoints } = useAccountBalancePoints(
    slug,
    from ?? '',
    to ?? ''
  );

  const refreshAccountBalance = () => {
    void queryClient.invalidateQueries({
      queryKey: GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY(slug, from ?? '', to ?? ''),
    });
  };

  const balancePoint = useMemo(() => {
    return balancePoints?.at(-1);
  }, [balancePoints]);

  console.log({ 'account?.currency': account?.currency });

  return (
    <div data-ui="account-overview" className="grid grid-cols-3 gap-4">
      <Surface size="md">
        <div className="flex items-center justify-between">
          <p className="text-primary text-sm">Balance</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            disabled={isLoadingBalancePoints}
            onClick={refreshAccountBalance}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Currency
          className="text-xl font-bold"
          variant="large"
          value={balancePoint?.balance}
          currency={account?.currency}
          autoColor
        />
      </Surface>

      {/* <Surface size="md" className="">
          <p className="text-primary text-sm">Earnings</p>
          <Currency className="text-xl font-bold" value={150} autoColor />
        </Surface>

        <Surface size="md" className="hover:bg-primary">
          <p className="text-primary text-sm">Spending</p>
          <Currency
            className="text-primary text-xl font-bold"
            value={0}
            currency={account?.currency}
          />
        </Surface> */}
    </div>
  );
};

export default AccountOverview;
