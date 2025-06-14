import { useAccount } from '@/domains/accounts/hooks/use-account';
import { useParams } from '@tanstack/react-router';

export const AccountScreen = () => {
  const { slug } = useParams({ from: '/(auth)/accounts/$slug/' });
  const { data: account, isLoading, error } = useAccount(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Account: {account?.name}</h1>
      <p>Balance: {account?.balance}</p>
      <p>Currency: {account?.currency}</p>
      <p>Type: {account?.type}</p>
      <p>Broker: {account?.broker?.name}</p>
    </div>
  );
};
