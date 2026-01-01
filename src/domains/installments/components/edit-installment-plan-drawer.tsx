import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/installments/index';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Edit, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/domains/ui-system/components/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import type { I_InstallmentPlan } from '@/domains/installments/types/types-and-interfaces';
import { installmentsApi } from '../api/installments.api';
import { getStatusStyle } from '../utils/get-status-style';
import { cn } from '@/domains/ui-system/utils';

export const EditInstallmentPlanDrawer = () => {
  const navigate = useNavigate();
  const { planId } = Route.useSearch();
  const params = useParams({ strict: false });
  const queryClient = useQueryClient();

  // Cache-first approach: Try to find plan in ANY paginated cache
  // Note: We use getQueriesData (plural) because the cache key includes params
  const cachedPlanData = queryClient.getQueriesData<{
    data: I_InstallmentPlan[];
  }>({
    queryKey: INSTALLMENTS_QUERY_KEYS.planList(params),
  });

  const cachedPlan = cachedPlanData
    .flatMap(([, data]) => data?.data ?? [])
    .find(plan => plan.id === planId);

  // 2. Fetch data if not in cache, using cached item as initialData
  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planDetail(planId!),
    queryFn: () => installmentsApi.getPlan(planId!),
    enabled: !!planId,
    initialData: cachedPlan as any,
  });

  const handleClose = () => {
    navigate({
      search: (prev: any) => {
        const next = { ...prev };
        delete next.drawer;
        delete next.planId;
        return next;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <p>Failed to load installment plan.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p>Installment plan not found.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  const paidInstallments = plan.installments?.filter(i => i.status === 'linked').length || 0;
  const progress = (paidInstallments / plan.installment_count) * 100;
  const remainingAmount =
    (plan.total_amount || 0) -
    (plan.installments?.filter(i => i.status === 'linked').reduce((acc, i) => acc + i.amount, 0) ||
      0);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col" data-ui="edit-installment-plan-drawer">
      <DrawerHeader
        title={plan.name}
        description="View and manage your installment plan"
        icon={Edit}
      />

      <div className="flex jus gap-4">
        <div className="flex w-1/2 flex-col gap-4">
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="text-xs text-muted-foreground font-medium">Total Amount</h4>
            <p className="text-2xl font-bold">
              {plan.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-primary text-neutral-white">
            <h4 className="text-xs">Total Remaining</h4>
            <p className="text-2xl font-bold">
              {remainingAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {paidInstallments}/{plan.installment_count} Paid
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 space-y-2">
          <p className="text-sm font-medium">Installment Breakdown</p>
          <div className="flex flex-col gap-2">
            {plan.installments.map(installment => (
              <div
                key={installment.id}
                className="p-3 border rounded-md bg-card text-sm flex justify-between items-center cursor-pointer hover:bg-accent"
                onClick={() => {
                  navigate({
                    search: (prev: any) => ({
                      ...prev,
                      drawer: 'installment-link-payment',
                      installmentId: installment.id,
                    }),
                  });
                }}
              >
                <div>
                  <span className="font-semibold text-muted-foreground mr-2">
                    #{installment.installment_number}
                  </span>
                  <span>{format(parseISO(installment.due_date), 'MMM dd, yyyy')}</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'capitalize text-xs py-0.5 px-2',
                    getStatusStyle(installment.status)
                  )}
                >
                  {installment.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
