import useBrokers from '@/domains/broker/hooks/use-brokers';
import BrokerCard from './broker-card';

import { Skeleton } from '@/domains/ui-system/components/skeleton';

const BrokerCardSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-card-background rounded-3xl overflow-hidden animate-pulse">
      <div className="flex items-start justify-between px-6 py-5">
        {/* Name Skeleton */}
        <Skeleton className="h-7 w-3/4 rounded-md bg-muted-foreground/20" />

        {/* Menu Button Skeleton */}
        <Skeleton className="h-8 w-8 rounded-lg bg-muted-foreground/20" />
      </div>

      <div className="px-6 py-8 bg-muted-foreground/10 h-24">
        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-muted-foreground/20" />
          <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div data-testid="brokers-loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-15">
      {Array.from({ length: 10 }).map((_, i) => (
        <BrokerCardSkeleton key={i} />
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div data-testid="brokers-empty" className="text-center py-12">
      <p className="text-lg text-muted-foreground">No brokers found!</p>
      <p className="text-sm mt-2 text-muted-foreground">Create your first broker to get started.</p>
    </div>
  );
};

const ErrorState = ({ error }: { error: Error }) => {
  return (
    <div data-testid="brokers-error" className="text-center py-8">
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
    <ul data-testid="brokers-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-15">
      {brokers.map(broker => (
        <li key={broker.id}>
          <BrokerCard broker={broker} />
        </li>
      ))}
    </ul>
  );
};

export default BrokersList;
