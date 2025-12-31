import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Plus, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { InstallmentForm } from './installment-form';
import { useCreateInstallmentPlan } from '../hooks/use-installments';
import * as dateFns from 'date-fns';
import { Badge } from '@/domains/ui-system/components/badge';

export const CreateInstallmentDrawer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const { mutate: createPlan, isPending: isSaving } = useCreateInstallmentPlan();

  const handleClose = () => {
    navigate({
      search: (prev: any) => {
        const next = { ...prev };
        delete next.drawer;
        return next;
      },
    });
  };

  const handleSubmit = (values: any) => {
    createPlan(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  // Preview Logic - Memoized for performance
  const installmentsPreview = useMemo(() => {
    const totalAmount = formData.total_amount || 0;
    const numInstallments = formData.num_installments || 0;
    const startDate = formData.start_date ? dateFns.parseISO(formData.start_date) : null;

    if (totalAmount <= 0 || numInstallments <= 0 || !startDate) {
      return [];
    }

    const monthlyAmount = totalAmount / numInstallments;
    return Array.from({ length: numInstallments }, (_, i) => ({
      number: i + 1,
      amount: monthlyAmount,
      date: dateFns.addMonths(startDate, i),
    }));
  }, [formData.total_amount, formData.num_installments, formData.start_date]);

  const totalAmount = formData.total_amount || 0;

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create Installment Plan"
          icon={Plus}
        />
        <div className="flex gap-2">
          <Button size="lg" form="installment-plan-form" type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-8 h-full">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-6">
              Create a new installment plan to track a large purchase over multiple months.
            </p>
            <InstallmentForm onSubmit={handleSubmit} onFormChange={setFormData} />
          </div>
          
          <div className="col-span-1 border-l pl-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Plan Preview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generated schedule based on your input.
              </p>
              
              {installmentsPreview.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Payment:</span>
                      <span className="font-bold text-primary">
                        ${installmentsPreview[0].amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
                      Installment Timeline
                    </p>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                      {installmentsPreview.map((item) => (
                        <div key={item.number} className="flex items-center justify-between p-3 border rounded-lg text-sm bg-card">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                              {item.number}
                            </Badge>
                            <div className="flex flex-col">
                              <span className="font-medium text-xs">
                                {dateFns.format(item.date, 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-semibold">
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <Calendar className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs">Fill out the amount and number of installments to see the preview.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

