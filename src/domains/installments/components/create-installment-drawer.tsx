import { useMemo } from 'react';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { InstallmentForm } from './installment-form';
import { useCreateInstallmentPlan } from '@/domains/installments/hooks/use-create-installment-plan';
import * as dateFns from 'date-fns';
import { Badge } from '@/domains/ui-system/components/badge';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import type { I_CreateInstallmentPlanRequest } from '../types/types-and-interfaces';
import { useNavigate } from '@tanstack/react-router';

const installmentFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  total_amount: z.number().min(0.01, 'Total amount must be greater than 0.'),
  installment_count: z.number().int().min(2, 'Must have at least 2 installments.'),
  start_date: z.string().min(1, 'Start date is required.'),
  vendor_id: z.string().optional(),
  category_id: z.string().optional(),
  credit_card_id: z.string().optional(),
});

export const CreateInstallmentDrawer = () => {
  const navigate = useNavigate();
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

  const form = useForm<I_CreateInstallmentPlanRequest>({
    validatorAdapter: zodValidator,
    defaultValues: {
      name: '',
      description: '',
      total_amount: 0,
      installment_count: 2,
      start_date: dateFns.format(new Date(), 'yyyy-MM-dd'),
      vendor_id: '',
      category_id: '',
      credit_card_id: '',
    },
    onSubmit: async ({ value }) => {
      const submittedValue: I_CreateInstallmentPlanRequest = {
        ...value,
        vendor_id: value.vendor_id || undefined,
        category_id: value.category_id || undefined,
        credit_card_id: value.credit_card_id || undefined,
        description: value.description || undefined,
      };
      createPlan(submittedValue, {
        onSuccess: handleClose,
      });
    },
  });
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="p-6 space-y-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create Installment Plan"
          icon={Plus}
        />
        <div className="flex gap-2">
          <Button type="submit" size="lg" disabled={isSaving}>
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
            <InstallmentForm form={form} />
          </div>
          
          <div className="col-span-1 border-l pl-8 space-y-6">
            <form.Subscribe
              selector={(state) => state.values}
              children={(formValues) => {
                const installmentsPreview = useMemo(() => {
                  const { total_amount, installment_count, start_date } = formValues;
                  if (total_amount <= 0 || installment_count <= 0 || !start_date) {
                    return [];
                  }
                  const monthlyAmount = total_amount / installment_count;
                  const startDate = dateFns.parseISO(start_date);
                  return Array.from({ length: installment_count }, (_, i) => ({
                    number: i + 1,
                    amount: monthlyAmount,
                    date: dateFns.addMonths(startDate, i),
                  }));
                }, [formValues]);

                return (
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
                            <span className="font-semibold">${formValues.total_amount?.toFixed(2)}</span>
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
                );
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
