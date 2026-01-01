import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { Calendar, Plus } from 'lucide-react';
import type { I_InstallmentPlan, I_InstallmentPlansParams } from '../types/types-and-interfaces';
import { useDeleteInstallmentPlan } from '../hooks/use-installments';
import { toast } from 'sonner';
import { CardDescription } from '@/domains/ui-system/components/card';
import { InstallmentPlanItem } from './installment-plan-item';
import { LoadingState, ErrorState, EmptyState } from './installment-plan-list-states';
import { Button } from '@/domains/ui-system/components/button';

interface InstallmentPlanListProps {
  plans: I_InstallmentPlan[];
  totalCount?: number;
  page?: number;
  perPage?: number;
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
  params: I_InstallmentPlansParams;
  onParamsChange: (
    params:
      | I_InstallmentPlansParams
      | ((prev: I_InstallmentPlansParams) => I_InstallmentPlansParams)
  ) => void;
}

export const InstallmentPlanList = ({
  plans,
  totalCount,
  page = 1,
  perPage = 20,
  isLoading,
  isError,
  isPlaceholderData,
  params,
  onParamsChange,
}: InstallmentPlanListProps) => {
  const navigate = useNavigate();
  const { mutate: deletePlanMutation } = useDeleteInstallmentPlan();

  const handleAdd = () => {
    (navigate as any)({
      search: (prev: any) => ({ ...prev, drawer: 'installment-plan-create' }),
    });
  };

  const handleEdit = (planId: string) => {
    (navigate as any)({
      search: (prev: any) => ({ ...prev, drawer: 'installment-plan-edit', planId }),
    });
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this installment plan? This will also remove all projected installments.'
      )
    ) {
      deletePlanMutation(id, {
        onSuccess: () => {
          toast.success('Plan deleted successfully.');
        },
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    onParamsChange(prev => ({ ...prev, page: newPage }));
  };

  console.log({ plans });
  if (isLoading && !isPlaceholderData) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (plans.length === 0) {
    return <EmptyState onAdd={handleAdd} />;
  }

  return (
    <div data-ui="installment-plan-list" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="grid items-center ">
          <h2 className="text-2xl tracking-tight text-primary">Purchases</h2>
          <p className="text-sm">
            {totalCount ? (
              <>
                <span>Total</span> <span className="ml-1 text-xl font-semibold">{totalCount}</span>
              </>
            ) : (
              'Manage your installment purchases and track debt progress.'
            )}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Previous data shown)</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Add Plan</span>
          <Button className="rounded-full w-8 h-8" size="icon" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {plans.map(plan => (
          <InstallmentPlanItem
            key={plan.id}
            plan={plan}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {totalCount && totalCount > perPage && (
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, totalCount)} of{' '}
              {totalCount} plans
            </span>
          </div>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalCount / perPage)}
            hasNext={page * perPage < totalCount && !isPlaceholderData}
            hasPrevious={page > 1 && !isPlaceholderData}
            onPageChange={handlePageChange}
            className={isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}
          />
        </div>
      )}
    </div>
  );
};
