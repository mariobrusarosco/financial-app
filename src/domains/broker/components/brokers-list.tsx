import useBrokers from '@/domains/broker/hooks/use-brokers';
import BrokerCard from './broker-card';

const LoadingState = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Loading brokers...</p>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">No brokers found!</p>
      <p className="text-sm mt-2 text-muted-foreground">Create your first broker to get started.</p>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  return (
    <div className="text-center py-8">
      <p className="text-destructive">Error loading brokers: {error.message}</p>
    </div>
  );
};

const BrokersList = () => {
  const { data: brokers, isLoading, error } = useBrokers();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!brokers || brokers.length === 0) return <EmptyState />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-6">
      {brokers.map(broker => (
        <li key={broker.id}>
          <BrokerCard broker={broker} />
        </li>
      ))}
    </ul>
  );
};

export default BrokersList;
