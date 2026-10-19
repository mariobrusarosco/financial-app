import { Button } from '@ui-system/components/button';
import {
  DrawerLayout,
  DrawerLayoutAside,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { CalendarDays, Loader2 } from 'lucide-react';
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
    <DrawerLayout data-ui="create-installment-drawer">
      <DrawerLayoutHeader
        icon={CalendarDays}
        title="New installment plan"
        description="Track a large purchase paid over several months."
      />
      <DrawerLayoutBody
        aside={
          <DrawerLayoutAside>
            <form.Subscribe selector={state => state.values}>
              {formValues => (
                <InstallmentPlanPreview
                  totalAmount={formValues.total_amount}
                  installmentCount={formValues.installment_count}
                  startDate={formValues.start_date}
                />
              )}
            </form.Subscribe>
          </DrawerLayoutAside>
        }
      >
        <form
          id="installment-plan-create-form"
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <InstallmentForm form={form} />
        </form>
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <DrawerLayoutCancel />
        <Button type="submit" form="installment-plan-create-form" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Creating…' : 'Create plan'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
