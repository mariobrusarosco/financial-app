import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';
import { Link } from '@tanstack/react-router';

function AccountsList() {
  const { data: accounts, isLoading, error } = useGetAllActiveAccounts();

  if (isLoading) return <p>Loading accounts...</p>;
  if (error) return <p>Error fetching accounts: {error.message}</p>;
  if (!accounts || accounts.length === 0) return <p>No active accounts found.</p>;

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {accounts.map(account => (
          <li key={account.id}>
            <Link to="/accounts/$slug" params={{ slug: account.id }}>
              {account.name} - Balance: {account.currency} {account.balance}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountsList;
