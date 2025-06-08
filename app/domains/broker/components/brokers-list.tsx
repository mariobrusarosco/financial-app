import useBrokers from '@/domains/broker/hooks/use-brokers';

const BrokersList = () => {
  const { data: brokers, isLoading, error } = useBrokers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!brokers || brokers.length === 0) return <p>No brokers found.</p>;

  return (
    <div>
      {brokers.map(broker => (
        <div key={broker.id}>{broker.name}</div>
      ))}
    </div>
  );
};

export default BrokersList;
