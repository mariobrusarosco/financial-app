import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
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
import type { I_CreateSubscriptionRequest, I_Subscription } from '../types/types-and-interfaces';
import { useVendors } from '@/domains/vendors/hooks';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { TransactionDatePicker } from '@/domains/transactions/components/transaction-date-picker';
import * as dateFns from 'date-fns';
import { useCategories } from '@/domains/categories/hooks/use-categories';

const BILLING_CYCLES = ['daily', 'weekly', 'monthly', 'annually'] as const;

const subscriptionFormSchema = z.object({
  name: z.string().min(1, 'Subscription name is required.'),
  amount: z.number().min(0.01, 'Amount must be greater than 0.'),
  billing_cycle: z.enum(BILLING_CYCLES, {
    message: 'Billing cycle is required.',
  }),
  next_due_date: z.string().min(1, 'Next due date is required.'),
  end_date: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
  vendor_id: z.string().min(1, 'Vendor is required.'),
  account_id: z.string().min(1, 'Account is required.'),
  category_id: z.string().min(1, 'Category is required.'),
});

interface SubscriptionFormProps {
  initialValues?: I_Subscription;
  onSubmit: (values: I_CreateSubscriptionRequest) => void;
}

export const SubscriptionForm = ({ initialValues, onSubmit }: SubscriptionFormProps) => {
  const { data: vendorsData } = useVendors();
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();

  const availableVendors = vendorsData?.data || [];
  const availableAccounts = accountsData || [];

  const availableCategories: { id: string; name: string; level: number }[] = [];
  (categoriesData || []).forEach(cat => {
    availableCategories.push({ id: cat.id, name: cat.name, level: 0 });
    if (cat.children) {
      cat.children.forEach(child => {
        availableCategories.push({ id: child.id, name: child.name, level: 1 });
      });
    }
  });

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      name: initialValues?.name || '',
      amount: initialValues?.amount ? parseFloat(initialValues.amount.toString()) : 0,
      billing_cycle: (initialValues?.billing_cycle || 'monthly') as any,
      next_due_date: initialValues?.next_due_date || dateFns.format(new Date(), 'yyyy-MM-dd'),
      end_date: initialValues?.end_date || '',
      notes: initialValues?.notes || '',
      is_active: initialValues?.is_active ?? true,
      vendor_id: initialValues?.vendor_id || '',
      account_id: initialValues?.account_id || '',
      category_id: initialValues?.category_id || '',
    },
    onSubmit: async ({ value }) => {
      const submittedValue: I_CreateSubscriptionRequest = {
        ...value,
        amount: parseFloat(value.amount.toString()),
        end_date: value.end_date === '' ? undefined : value.end_date,
      } as I_CreateSubscriptionRequest;
      onSubmit(submittedValue);
    },
  });

  return (
    <form
      id="subscription-form"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field
          name="name"
          validators={{
            onChange: subscriptionFormSchema.shape.name,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Subscription Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: subscriptionFormSchema.shape.amount,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(parseFloat(e.target.value))}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="billing_cycle"
          validators={{
            onChange: subscriptionFormSchema.shape.billing_cycle,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Billing Cycle</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map(cycle => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field
          name="next_due_date"
          validators={{
            onChange: subscriptionFormSchema.shape.next_due_date,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Next Due Date</Label>
              <TransactionDatePicker
                date={field.state.value ? dateFns.parseISO(field.state.value) : undefined}
                setDate={date => field.handleChange(date ? dateFns.format(date, 'yyyy-MM-dd') : '')}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="end_date"
          validators={{
            onChange: subscriptionFormSchema.shape.end_date,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>End Date (Optional)</Label>
              <TransactionDatePicker
                date={field.state.value ? dateFns.parseISO(field.state.value) : undefined}
                setDate={date => field.handleChange(date ? dateFns.format(date, 'yyyy-MM-dd') : '')}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="notes"
          validators={{
            onChange: subscriptionFormSchema.shape.notes,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Notes (Optional)</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <form.Field
          name="is_active"
          validators={{
            onChange: subscriptionFormSchema.shape.is_active,
          }}
          children={field => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={checked => field.handleChange(!!checked)}
              />
              <Label htmlFor={field.name}>Is Active</Label>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="vendor_id"
          validators={{
            onChange: subscriptionFormSchema.shape.vendor_id,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Vendor</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {availableVendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="account_id"
          validators={{
            onChange: subscriptionFormSchema.shape.account_id,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Account</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {availableAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="category_id"
          validators={{
            onChange: subscriptionFormSchema.shape.category_id,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Category</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.level > 0 ? `\u00A0\u00A0 ${category.name}` : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>
    </form>
  );
};
