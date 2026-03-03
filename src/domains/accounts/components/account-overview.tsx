import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Currency } from '@/domains/ui-system/components/currency';
import { Button } from '@/domains/ui-system/components/button';
import { RefreshCw } from 'lucide-react';
import { GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY } from '../api/keys';
import { useQueryClient } from '@tanstack/react-query';
import { useAccountBalancePoints } from '../hooks/use-account-balance-points';
import { Route } from '@/routes/(auth)/route';
import { useMemo } from 'react';
import { AccountBalancePoints } from './account-balance-points';

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

  const transactionsQuery = queryClient.getQueryData(
    GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY(slug, from ?? '', to ?? '')
  );

  console.log({ transactionsQuery });

  return (
    <div data-ui="account-overview" className="flex justify-between gap-4 pt-6">
      <div
        className="flex flex-col gap-2 bg-neutral-white w-fit p-2.5 md:p-4 rounded-lg h-fit"
        data-ui="account-overview-balance"
      >
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
          variant="default"
          value={balancePoint?.balance}
          currency={account?.currency}
          autoColor
        />
      </div>

      <AccountBalancePoints slug={slug} title="" />
    </div>
  );
};

export default AccountOverview;
