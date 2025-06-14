import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Link, useParams } from '@tanstack/react-router';

export const AccountScreen = () => {
  const { slug } = useParams({ from: '/(auth)/accounts/$slug/' });
  const { data: account, isLoading, error } = useAccount(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Account: {account?.name}</h1>
        <Link to="/accounts" className="text-blue-500 hover:text-blue-700">
          Back
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4 max-w-[200px]">
        <Link
          to="/accounts/$slug/statements"
          params={{ slug }}
          className="text-blue-500 hover:text-blue-700"
        >
          Statements
        </Link>

        <Link
          to="/accounts/$slug/credit-card"
          params={{ slug }}
          className="text-blue-500 hover:text-blue-700"
        >
          Credit Card
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">Balance: {account?.balance}</p>
        <p className="text-sm text-gray-500">Currency: {account?.currency}</p>
        <p className="text-sm text-gray-500">Type: {account?.type}</p>
        <p className="text-sm text-gray-500">Broker: {account?.broker?.name}</p>
      </div>
    </div>
  );
};
