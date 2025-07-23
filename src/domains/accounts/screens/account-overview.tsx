import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';

interface AccountOverviewScreenProps {
  slug: string;
}

export const AccountOverviewScreen = ({ slug }: AccountOverviewScreenProps) => {
  return (
    <div className="flex flex-col">
      <AccountTransactionsList accountId={slug} />
    </div>
  );
};
