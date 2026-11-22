import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { Checkbox } from '@/domains/ui-system/components/checkbox';
import type { I_CreateSubscriptionRequest, I_Subscription } from '../types/types-and-interfaces';
import { useVendors } from '@/domains/vendors/hooks';
import { VendorSelector } from '@/domains/vendors/components/vendor-selector';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { TransactionDatePicker } from '@/domains/transactions/components/transaction-date-picker';
import { TagSelector } from '@/domains/tags/components/tag-selector';
import * as dateFns from 'date-fns';

const BILLING_CYCLES = ['weekly', 'monthly', 'quarterly', 'yearly'] as const;

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
  payment_source: z.string().min(1, 'Choose the account or credit card it is paid with.'),
});

interface SubscriptionFormProps {
  initialValues?: I_Subscription;
  onSubmit: (values: I_CreateSubscriptionRequest) => void;
}

export const SubscriptionForm = ({ initialValues, onSubmit }: SubscriptionFormProps) => {
  // Fetch all vendors for selector (max allowed by API)
  const { data: vendorsData } = useVendors({ per_page: 100 });
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const { data: creditCardsData } = useCreditCards(undefined);

  const availableVendors = vendorsData?.data || [];
  const availableAccounts = accountsQuery.data?.accounts ?? [];
  const availableCreditCards = creditCardsData?.data ?? [];

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
      payment_source: toPaymentSource(initialValues),
      tag_ids: initialValues?.tag_ids ?? [],
    },
    onSubmit: async ({ value }) => {
      const { tag_ids: tagIds, payment_source: paymentSource, ...rest } = value;
      // When editing, only send tag_ids if they changed: PATCH replaces the whole set
      const hasTagChanges = !initialValues || !haveSameTagIds(tagIds, initialValues.tag_ids ?? []);
      const submittedValue: I_CreateSubscriptionRequest = {
        ...rest,
        ...fromPaymentSource(paymentSource),
        amount: parseFloat(value.amount.toString()),
        end_date: value.end_date === '' ? undefined : value.end_date,
        ...(hasTagChanges && { tag_ids: tagIds }),
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
              <VendorSelector
                value={field.state.value}
                onValueChange={field.handleChange}
                vendors={availableVendors}
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="payment_source"
          validators={{
            onChange: subscriptionFormSchema.shape.payment_source,
          }}
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Paid with</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Account or credit card" />
                </SelectTrigger>
                <SelectContent>
                  {availableCreditCards.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Credit cards</SelectLabel>
                      {availableCreditCards.map(creditCard => (
                        <SelectItem
                          key={creditCard.id}
                          value={`${CREDIT_CARD_SOURCE}${creditCard.id}`}
                        >
                          {creditCard.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    {availableAccounts.map(account => (
                      <SelectItem key={account.id} value={`${ACCOUNT_SOURCE}${account.id}`}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>

      <form.Field
        name="tag_ids"
        children={field => (
          <div className="space-y-2 md:max-w-xl">
            <Label>Tags (Optional)</Label>
            <TagSelector
              value={field.state.value}
              onValueChange={field.handleChange}
              historicalTags={initialValues?.tags}
              placeholder="Select tags…"
            />
          </div>
        )}
      />
    </form>
  );
};

// One select holds both kinds of source, so each option's value says which one it is
const ACCOUNT_SOURCE = 'account:';
const CREDIT_CARD_SOURCE = 'credit_card:';

const toPaymentSource = (subscription?: I_Subscription) => {
  if (subscription?.credit_card_id) return `${CREDIT_CARD_SOURCE}${subscription.credit_card_id}`;
  if (subscription?.account_id) return `${ACCOUNT_SOURCE}${subscription.account_id}`;
  return '';
};

// The API takes both fields, the one not chosen as null
const fromPaymentSource = (paymentSource: string) => ({
  account_id: paymentSource.startsWith(ACCOUNT_SOURCE)
    ? paymentSource.slice(ACCOUNT_SOURCE.length)
    : null,
  credit_card_id: paymentSource.startsWith(CREDIT_CARD_SOURCE)
    ? paymentSource.slice(CREDIT_CARD_SOURCE.length)
    : null,
});

const haveSameTagIds = (left: string[], right: string[]) =>
  left.length === right.length && left.every(tagId => right.includes(tagId));
