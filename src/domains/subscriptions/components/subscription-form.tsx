import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { Checkbox } from '@/domains/ui-system/components/checkbox';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import type {
  I_CreateSubscriptionRequest,
  I_Subscription,
  T_BillingCycle,
} from '../types/types-and-interfaces';
import { useVendors } from '@/domains/vendors/hooks';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts'; // Assuming this hook exists
import { TransactionDatePicker } from '@/domains/transactions/components/transaction-date-picker';
import * as dateFns from 'date-fns';
import type { I_AccountsResponse } from '@/domains/accounts/types/types-and-interfaces'; // Import I_AccountsResponse

const BILLING_CYCLES = ['daily', 'weekly', 'monthly', 'annually'] as const; // Define constant array for enum

const subscriptionFormSchema = z.object({
  name: z.string().min(1, 'Subscription name is required.'),
  amount: z.preprocess(
    (a) => parseFloat(a as string), // Preprocess to ensure number type for Zod validation
    z.number().min(0.01, 'Amount must be greater than 0.'),
  ),
  currency: z.string().min(1, 'Currency is required.'),
  frequency: z.enum(BILLING_CYCLES, { // Changed from z.nativeEnum to z.enum
    errorMap: () => ({ message: 'Billing cycle is required.' }),
  }),
  start_date: z.string().min(1, 'Start date is required.'),
  end_date: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
  vendor_id: z.string().min(1, 'Vendor is required.'),
  account_id: z.string().min(1, 'Account is required.'),
});

interface SubscriptionFormProps {
  initialValues?: I_Subscription;
  onSubmit: (values: I_CreateSubscriptionRequest) => void;
  isLoading: boolean;
  isEditMode: boolean;
}

export const SubscriptionForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isEditMode,
}: SubscriptionFormProps) => {
  const { data: vendorsData } = useVendors();
  const { data: accountsResponse } = useAccounts(); // Use accountsResponse to correctly access data

  const availableVendors = useMemo(() => vendorsData?.data || [], [vendorsData]);
  const availableAccounts = useMemo(() => (accountsResponse as I_AccountsResponse)?.data || [], [accountsResponse]); // Cast to I_AccountsResponse

  const form = useForm({
    defaultValues: {
      name: initialValues?.name || '',
      amount: initialValues?.amount || 0,
      currency: initialValues?.currency || 'USD', // Default currency
      frequency: initialValues?.frequency || 'monthly',
      start_date: initialValues?.start_date || dateFns.format(new Date(), 'yyyy-MM-dd'),
      end_date: initialValues?.end_date || '',
      notes: initialValues?.notes || '',
      is_active: initialValues?.is_active || true,
      vendor_id: initialValues?.vendor_id || '',
      account_id: initialValues?.account_id || '',
    },
    onSubmit: async ({ value }) => {
      // Ensure amount is number and dates are correct format
      const submittedValue: I_CreateSubscriptionRequest = {
        ...value,
        amount: parseFloat(value.amount.toString()),
        next_payment_date: value.start_date, // For creation, next payment is start date
        // Adjust end_date to undefined if empty string
        end_date: value.end_date === '' ? undefined : value.end_date,
      };
      onSubmit(submittedValue);
    },
  });

  // Reset form if initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldValue('name', initialValues.name);
      form.setFieldValue('amount', parseFloat(initialValues.amount.toString()));
      form.setFieldValue('currency', initialValues.currency);
      form.setFieldValue('frequency', initialValues.frequency);
      form.setFieldValue('start_date', initialValues.start_date);
      form.setFieldValue('end_date', initialValues.end_date || '');
      form.setFieldValue('notes', initialValues.notes || '');
      form.setFieldValue('is_active', initialValues.is_active);
      form.setFieldValue('vendor_id', initialValues.vendor_id);
      form.setFieldValue('account_id', initialValues.account_id);
    } else {
      // Reset for create mode
      form.setFieldValue('name', '');
      form.setFieldValue('amount', 0);
      form.setFieldValue('currency', 'USD');
      form.setFieldValue('frequency', 'monthly');
      form.setFieldValue('start_date', dateFns.format(new Date(), 'yyyy-MM-dd'));
      form.setFieldValue('end_date', '');
      form.setFieldValue('notes', '');
      form.setFieldValue('is_active', true);
      form.setFieldValue('vendor_id', '');
      form.setFieldValue('account_id', '');
    }
  }, [initialValues, form]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 p-4"
    >
      <form.Field
        name="name"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.name.safeParse(value).success ? undefined : subscriptionFormSchema.shape.name.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Subscription Name</Label>
            <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="amount"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.amount.safeParse(parseFloat(value as string)).success ? undefined : subscriptionFormSchema.shape.amount.safeParse(parseFloat(value as string)).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Amount</Label>
            <Input id={field.name} name={field.name} type="number" step="0.01" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="currency"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.currency.safeParse(value).success ? undefined : subscriptionFormSchema.shape.currency.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Currency</Label>
            <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="frequency"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.frequency.safeParse(value).success ? undefined : subscriptionFormSchema.shape.frequency.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Billing Cycle</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="start_date"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.start_date.safeParse(value).success ? undefined : subscriptionFormSchema.shape.start_date.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Start Date</Label>
            <TransactionDatePicker
              date={dateFns.parseISO(field.state.value)}
              setDate={date => field.handleChange(dateFns.format(date, 'yyyy-MM-dd'))}
            />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="end_date"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.end_date.safeParse(value).success ? undefined : subscriptionFormSchema.shape.end_date.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>End Date (Optional)</Label>
            <TransactionDatePicker
              date={field.state.value ? dateFns.parseISO(field.state.value) : undefined}
              setDate={date => field.handleChange(date ? dateFns.format(date, 'yyyy-MM-dd') : '')}
            />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="notes"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.notes.safeParse(value).success ? undefined : subscriptionFormSchema.shape.notes.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Notes (Optional)</Label>
            <Input id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="is_active"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.is_active.safeParse(value).success ? undefined : subscriptionFormSchema.shape.is_active.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.name} checked={field.state.value} onCheckedChange={field.handleChange} />
            <Label htmlFor={field.name}>Is Active</Label>
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="vendor_id"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.vendor_id.safeParse(value).success ? undefined : subscriptionFormSchema.shape.vendor_id.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Vendor</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {availableVendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <form.Field
        name="account_id"
        validators={{ onChange: ({ value }) => (subscriptionFormSchema.shape.account_id.safeParse(value).success ? undefined : subscriptionFormSchema.shape.account_id.safeParse(value).error?.issues[0].message), }}
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Account</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {availableAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (<em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>)}
          </div>
        )}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading || !form.state.canSubmit}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Save Changes' : 'Create Subscription'}
        </Button>
      </div>
    </form>
  );
};
