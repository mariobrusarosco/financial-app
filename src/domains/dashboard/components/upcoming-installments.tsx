import { AlertCircle, AlertTriangle, Receipt } from 'lucide-react';
import { Badge } from '@/domains/ui-system/components/badge';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { formatCurrencyAmount, formatDateMedium } from '@/domains/global/utils/formatting';
import { useUpcomingInstallments } from '@/domains/dashboard/hooks/use-upcoming-installments';
import { T_InstallmentStatus } from '@/domains/installments/types/types-and-interfaces';

const cardClassName = 'w-full md:w-[400px] min-h-[25rem] rounded-md bg-foreground p-6';
const bodyClassName = 'flex min-h-[18rem] flex-1 flex-col justify-center';
const listClassName = 'grid content-start gap-4';

const UpcomingInstallmentsHeader = () => {
  return (
    <div className="mb-8 flex gap-4">
      <Receipt className="h-10 w-10 rounded-md bg-sky-700 p-2.5 text-neutral-white" />
      <h3 className="text-2xl font-light text-primary">Installments</h3>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div data-test-id="upcoming-installments-loading" className={listClassName}>
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
      data-test-id="upcoming-installments-error"
      className={`${bodyClassName} items-center text-center`}
    >
      <div className="space-y-2">
        <p className="text-sm text-destructive">We couldn&apos;t load your installments.</p>
        <p className="text-sm text-muted-foreground">Please try again in a moment.</p>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div
      data-test-id="upcoming-installments-empty"
      className={`${bodyClassName} items-center text-center`}
    >
      <div className="space-y-2">
        <p className="text-sm text-primary">No installments due in this period.</p>
        <p className="text-sm text-muted-foreground">Active installment plans will appear here.</p>
      </div>
    </div>
  );
};

const InstallmentStatusBadge = ({ status }: { status: T_InstallmentStatus }) => {
  if (status === 'overdue') {
    return (
      <Badge variant="outline" className="gap-1 bg-red-50 px-2 py-0.5 text-red-700">
        <AlertTriangle className="h-3 w-3" />
        Overdue
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-orange-100/90 px-2 py-0.5 text-orange-700">
      <AlertCircle className="h-3 w-3" />
      Due
    </Badge>
  );
};

export const UpcomingInstallments = () => {
  const { data, states } = useUpcomingInstallments();

  return (
    <section data-test-id="upcoming-installments" className={`${cardClassName} flex flex-col`}>
      <UpcomingInstallmentsHeader />

      {states.isLoading ? <LoadingState /> : null}
      {states.isError ? <ErrorState /> : null}
      {states.isEmpty ? <EmptyState /> : null}

      {!states.isLoading && !states.isError && !states.isEmpty ? (
        <div className={listClassName}>
          {data.installments.map(installment => (
            <div
              key={installment.id}
              className="flex items-center justify-between rounded-sm bg-neutral-white/80 p-4"
            >
              <div className="flex flex-col space-y-1">
                <span className="leading-none text-primary">{installment.planName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateMedium(installment.dueDate)} •{' '}
                  {formatCurrencyAmount(installment.amount)} • #{installment.installmentNumber} of{' '}
                  {installment.installmentCount}
                </span>
              </div>
              <InstallmentStatusBadge status={installment.status} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
