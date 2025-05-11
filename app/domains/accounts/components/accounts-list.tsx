import { useGetAllActiveAccounts } from '@/domains/accounts/hooks/use-accounts';

function AccountsList() {
  const { data: accounts, isLoading, error } = useGetAllActiveAccounts();

  if (isLoading) return <p>Loading accounts...</p>;
  if (error) return <p>Error fetching accounts: {error.message}</p>;
  if (!accounts || accounts.length === 0) return <p>No active accounts found.</p>;

  return (
    <div>
      <h2>Active Accounts</h2>
      <ul>
        {accounts.map(account => (
          <li key={account.id}>
            {account.name} - Balance: {account.currency} {account.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountsList;