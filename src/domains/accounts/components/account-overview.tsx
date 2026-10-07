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

  return (
    <section data-ui="account-overview" className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div
        className="flex min-h-64 flex-col justify-between rounded-2xl bg-[#2b2865] p-5 text-white shadow-lg shadow-primary/10"
        data-ui="account-overview-balance"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/70">Current balance</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
            disabled={isLoadingBalancePoints}
            onClick={refreshAccountBalance}
            aria-label="Refresh balance"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Currency
            variant="large"
            value={balancePoint?.balance ?? account?.balance}
            currency={account?.currency}
            className="financial-value text-3xl text-white"
          />
          <p className="mt-2 text-xs text-white/55">Updated from recorded balance points</p>
        </div>
      </div>

      <div className="min-h-64 rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)]">
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-foreground">Balance history</h2>
          <p className="text-xs text-muted-foreground">Movement across the selected period</p>
        </div>
        <AccountBalancePoints slug={slug} title="" />
      </div>
    </section>
  );
};

export default AccountOverview;
