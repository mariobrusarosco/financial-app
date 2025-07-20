import useBrokers from '@/domains/broker/hooks/use-brokers';
import BrokerCard from './broker-card';

const BrokersList = () => {
  const { data: brokers, isLoading, error } = useBrokers();

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (!brokers || brokers.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No brokers found!</p>
        <p className="text-sm mt-2">Create your first broker to get started.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {brokers.map(broker => (
        <BrokerCard key={broker.id} broker={broker} />
      ))}
    </div>
  );
};

export default BrokersList;
