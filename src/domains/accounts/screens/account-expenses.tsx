import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';

interface AccountExpensesScreenProps {
  slug: string;
}

export const AccountExpensesScreen = ({ slug }: AccountExpensesScreenProps) => {
  return (
    <div
      data-ui="account-expenses-screen"
      className="grid grid-cols-[300px_1fr] justify-between gap-12"
    >
      <AccountBalancePoints slug={slug} />
      <AccountTransactionsList accountId={slug} initialType="expense" />
    </div>
  );
};
