import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';

interface AccountIncomeScreenProps {
  slug: string;
}

export const AccountIncomeScreen = ({ slug }: AccountIncomeScreenProps) => {
  return (
    <div
      data-ui="account-income-screen"
      className="grid grid-cols-[300px_1fr] justify-between gap-12"
    >
      <AccountBalancePoints slug={slug} />
      <AccountTransactionsList accountId={slug} initialType="income" />
    </div>
  );
};
