import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/installments/index';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Edit, Loader2 } from 'lucide-react';
import { useInstallmentPlan } from '../hooks/use-installments';
import { format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import { Badge } from '@/domains/ui-system/components/badge';

export const EditInstallmentDrawer = () => {
  const navigate = useNavigate();
  const { planId } = Route.useSearch();

  const { data: planResponse, isLoading, isError } = useInstallmentPlan(planId as string);
  const plan = planResponse?.data;

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

  if (isError || !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <p>Failed to load installment plan.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">Close</Button>
      </div>
    );
  }

  const paidInstallments = plan.installments?.filter(i => i.status === 'paid').length || 0;
  const progress = (paidInstallments / plan.num_installments) * 100;
  const remainingAmount = (plan.total_amount || 0) - (plan.installments?.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0) || 0);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <DrawerHeader
        title={plan.name}
        description="View and manage your installment plan"
        icon={Edit}
      />
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="text-xs text-muted-foreground font-medium">Total Remaining</h4>
            <p className="text-2xl font-bold">{remainingAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="text-xs text-muted-foreground font-medium">Total Amount</h4>
            <p className="text-2xl font-bold">{plan.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress: {paidInstallments}/{plan.num_installments} Paid</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Installment List */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Installment Breakdown</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {plan.installments.map((installment) => (
              <div key={installment.id} className="p-3 border rounded-md bg-card text-sm flex justify-between items-center">
                <div>
                  <span className="font-semibold text-muted-foreground mr-2">#{installment.installment_number}</span>
                  <span>{format(parseISO(installment.due_date), 'MMM dd, yyyy')}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "capitalize text-xs py-0.5 px-2",
                    installment.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    installment.status === 'overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
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
