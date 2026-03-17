import { Badge } from '@/domains/ui-system/components/badge';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { CheckCircle2, AlertCircle, Repeat } from 'lucide-react';
import { formatDateMedium, formatCurrencyAmount } from '@/domains/global/utils/formatting';
import { useUpcomingSubscriptions } from '@/domains/dashboard/hooks/use-upcoming-subscriptions';

const cardClassName = 'w-full md:w-[400px] min-h-[25rem] rounded-md bg-foreground p-6';
const bodyClassName = 'flex min-h-[18rem] flex-1 flex-col justify-center';
const listClassName = 'grid content-start gap-4';

const UpcomingSubscriptionsHeader = () => {
  return (
    <div className="mb-8 flex gap-4">
      <Repeat className="h-10 w-10 rounded-md bg-rose-700 p-2.5 text-neutral-white" />
      <h3 className="text-2xl font-light text-primary">Subscriptions</h3>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div data-test-id="upcoming-subscriptions-loading" className={listClassName}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-sm bg-neutral-white/80 p-4"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 bg-muted-foreground/20" />
            <Skeleton className="h-3 w-40 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
};

const ErrorState = () => {
  return (
    <div
      data-test-id="upcoming-subscriptions-error"
      className={`${bodyClassName} items-center text-center`}
    >
      <div className="space-y-2">
        <p className="text-sm text-destructive">We couldn&apos;t load your subscriptions.</p>
        <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div
      data-test-id="upcoming-subscriptions-empty"
      className={`${bodyClassName} items-center text-center`}
    >
      <div className="space-y-2">
        <p className="text-sm text-primary">No active subscriptions in this period.</p>
        <p className="text-sm text-muted-foreground">When you add one, it will appear here.</p>
      </div>
    </div>
  );
};

export const UpcomingSubscriptions = () => {
  const { data, states } = useUpcomingSubscriptions();

  return (
    <section data-test-id="upcoming-subscriptions" className={`${cardClassName} flex flex-col`}>
      <UpcomingSubscriptionsHeader />

      {states.isLoading ? <LoadingState /> : null}
      {states.isError ? <ErrorState /> : null}
      {states.isEmpty ? <EmptyState /> : null}

      {!states.isLoading && !states.isError && !states.isEmpty ? (
        <div className={listClassName}>
          {data.subscriptions.map(subscription => (
            <div
              key={subscription.id}
              className="flex items-center justify-between rounded-sm bg-neutral-white/80 p-4"
            >
              <div className="flex flex-col space-y-1">
                <span className="leading-none text-primary">{subscription.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateMedium(subscription.next_due_date)} •{' '}
                  {formatCurrencyAmount(subscription.amount, { currency: subscription.currency })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {subscription.is_paid_this_cycle ? (
                  <Badge variant="outline" className="gap-1 bg-green-50 px-2 py-0.5 text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Paid
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1 bg-orange-100/90 px-2 py-0.5 text-orange-700"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Due
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
