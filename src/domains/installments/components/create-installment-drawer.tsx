import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Plus, Loader2 } from 'lucide-react';
import { InstallmentForm } from './installment-form';
import { InstallmentPlanPreview } from './installment-plan-preview';
import { useCreateInstallmentPlan } from '@/domains/installments/hooks/use-create-installment-plan';
import * as dateFns from 'date-fns';
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
      credit_card_id: '',
    },
    onSubmit: async ({ value }) => {
      const submittedValue: I_CreateInstallmentPlanRequest = {
        ...value,
        vendor_id: value.vendor_id || undefined,
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
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex min-h-0 flex-1 flex-col gap-6 p-6"
      data-ui="create-installment-drawer"
    >
      <div className="flex shrink-0 items-center justify-between">
        <DrawerHeader title="Create Installment Plan" icon={Plus} />
        <div className="flex gap-2">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-8 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
        <div className="lg:min-h-0 lg:overflow-y-auto lg:pr-2">
          <p className="mb-6 text-sm text-muted-foreground">
            Create a new installment plan to track a large purchase over multiple months.
          </p>
          <InstallmentForm form={form} />
        </div>

        <div className="flex min-h-[420px] flex-col lg:min-h-0 lg:border-l lg:pl-8">
          <form.Subscribe selector={state => state.values}>
            {formValues => (
              <InstallmentPlanPreview
                totalAmount={formValues.total_amount}
                installmentCount={formValues.installment_count}
                startDate={formValues.start_date}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    </form>
  );
};
