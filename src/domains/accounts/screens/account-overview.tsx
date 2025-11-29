import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';
interface AccountOverviewScreenProps {
  slug: string;
}

export const AccountOverviewScreen = ({ slug }: AccountOverviewScreenProps) => {
  return (
    <div
      data-ui="account-overview-screen"
      className="grid grid-cols-[300px_1fr] justify-between gap-12"
    >
      <AccountBalancePoints slug={slug} />
      <AccountTransactionsList accountId={slug} />
    </div>
  );
};
