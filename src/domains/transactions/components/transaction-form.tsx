import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { string, z } from 'zod';
import { useMemo, useState } from 'react';
import type {
  I_TransactionPayload,
  T_TransactionType,
  I_TransactionResponse,
} from '../types/types-and-interfaces';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useVendors } from '@/domains/vendors/hooks';
import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { Label } from '@/domains/ui-system/components/label';
import { Switch } from '@/domains/ui-system/components/switch';
import { Textarea } from '@/domains/ui-system/components/textarea';
import { RadioGroup, RadioGroupItem } from '@/domains/ui-system/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { TransactionDatePicker } from './transaction-date-picker';
import { HierarchicalCategorySelector } from './hierarchical-category-selector';
import { VendorSelector } from '@/domains/vendors/components/vendor-selector';
import { TransactionAmountField } from './transaction/transaction-amount-field';
import { cn } from '@/domains/ui-system';

const transactionSchema = z
  .object({
    description: z.string().min(1, 'Description is required'),
    amount: z.preprocess(
      val => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z
        .number({ required_error: 'Amount is required' })
        .refine(val => val !== 0, 'Amount must not be 0')
    ),
    date: z.string().min(1, 'Date is required'),
    movement_type: z.enum(['expense', 'income', 'investment', 'transfer'] as const),
    category_id: z.string().optional(), // Foreign key to user_categories
    account_id: z.string().optional(),
    credit_card_id: z.string().optional(),
    vendor_id: z.string().optional(),
    subscription_id: z.string().optional(),
    is_paid: z.boolean(),
    ignored: z.boolean(),
  })
  .refine(data => data.account_id || data.credit_card_id, {
    message: 'Either Account or Credit Card must be selected',
    path: ['account_id'],
  });

interface TransactionFormProps {
  initialValues?: Partial<I_TransactionPayload> & { id?: string };
  onSubmit: (values: I_TransactionPayload) => void;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export const TransactionForm = ({
  initialValues,
  onSubmit,
  isEditMode = false,
  onCancel,
}: TransactionFormProps) => {
  const { data: accounts, isFetching: isFetchingAccounts } = useAccounts();
  const { data: creditCards, isFetching: isFetchingCreditCards } = useCreditCards(undefined);
  // Fetch all vendors for selector (max allowed by API)
  const { data: vendorsData, isFetching: isFetchingVendors } = useVendors({ per_page: 100 });
  const { data: subscriptionsData, isFetching: isFetchingSubscriptions } = useSubscriptions({
    is_active: true,
  });

  const availableVendors = vendorsData?.data || [];
  const availableSubscriptions = useMemo(() => subscriptionsData?.data || [], [subscriptionsData]);

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      description: initialValues?.description || '',
      amount: initialValues?.amount ? String(initialValues.amount) : '',
      date: initialValues?.date || new Date().toISOString().split('T')[0],
      movement_type: (initialValues?.movement_type || 'expense') as T_TransactionType,
      category_id: initialValues?.category_id || '',
      account_id: initialValues?.account_id || '',
      credit_card_id: initialValues?.credit_card_id || '',
      vendor_id: initialValues?.vendor_id || '',
      subscription_id: initialValues?.subscription_id || '',
      is_paid: initialValues?.is_paid ?? false,
      ignored: initialValues?.ignored ?? false,
    },
    onSubmit: async ({ value }) => {
      const submissionData: I_TransactionPayload = {
        description: value.description,
        amount: Number(value.amount),
        date: value.date,
        movement_type: value.movement_type,
        category_id: value.category_id || undefined,
        account_id: value.account_id ? value.account_id : undefined,
        credit_card_id: value.credit_card_id ? value.credit_card_id : undefined,
        vendor_id: value.vendor_id || undefined,
        is_paid: value.is_paid,
        ignored: value.ignored,
      };

      if (value.subscription_id) {
        (submissionData as any).subscription_id = value.subscription_id;
      }

      const broker_id =
        creditCards?.data?.find(c => c.id === value.credit_card_id)?.broker_id ||
        accounts?.find(a => a.id === value.account_id)?.broker?.id;

      if (broker_id) {
        (submissionData as any).broker_id = broker_id;
      }

      onSubmit(submissionData);
    },
  });

  // Handle loading state after hook calls to avoid hook order errors
  if (isFetchingAccounts || isFetchingCreditCards || isFetchingVendors || isFetchingSubscriptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getAccountDisplayName = () => {
    if (initialValues?.credit_card_id) {
      const card = creditCards?.data?.find(c => c.id === initialValues.credit_card_id);
      return card ? `${card.name} (*${card.last_four_digits})` : 'Credit Card';
    }
    const account = accounts?.find(a => a.id === initialValues?.account_id);
    return account?.name || 'Account';
  };

  const getPaymentMethodLabel = () => {
    return initialValues?.credit_card_id ? 'Credit Card' : 'Account';
  };

  return (
    <form
      id="transaction-form"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.Field
        name="description"
        validators={{
          onChange: transactionSchema.shape.description,
        }}
      >
        {field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="Enter transaction description"
              rows={isEditMode ? 2 : 3}
              className={cn('min-h-[80px]', { 'text-sm': isEditMode })}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors
                  .map((error: any) =>
                    typeof error === 'string' ? error : error?.message || JSON.stringify(error)
                  )
                  .join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-4">
        <form.Field
          name="amount"
          validators={{
            onSubmit: transactionSchema.shape.amount,
          }}
        >
          {field => <TransactionAmountField field={field} isEditMode={isEditMode} />}
        </form.Field>

        <form.Field
          name="date"
          validators={{
            onChange: transactionSchema.shape.date,
          }}
        >
          {field => (
            <div className="space-y-2 max-w-[250px]">
              <Label htmlFor={field.name}>Date</Label>
              <TransactionDatePicker
                date={field.state.value ? new Date(field.state.value) : undefined}
                setDate={date => field.handleChange(date ? date.toISOString().split('T')[0] : '')}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors
                    .map((error: any) =>
                      typeof error === 'string' ? error : error?.message || JSON.stringify(error)
                    )
                    .join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="movement_type"
        validators={{
          onChange: transactionSchema.shape.movement_type,
        }}
      >
        {field => (
          <div className="space-y-3">
            <Label>Movement Type</Label>
            <RadioGroup
              value={field.state.value}
              onValueChange={value => field.handleChange(value as T_TransactionType)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="font-normal">
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="font-normal">
                  Income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investment" id="investment" />
                <Label htmlFor="investment" className="font-normal">
                  Investment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="font-normal">
                  Transfer
                </Label>
              </div>
            </RadioGroup>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors
                  .map((error: any) =>
                    typeof error === 'string' ? error : error?.message || JSON.stringify(error)
                  )
                  .join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-4">
        <form.Field name="category_id">
          {field => (
            <div className="space-y-2">
              <Label>Category</Label>
              <HierarchicalCategorySelector
                value={field.state.value || ''}
                onValueChange={field.handleChange}
                placeholder="Select category..."
                className="w-full"
                size={isEditMode ? 'sm' : 'default'}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="subscription_id">
          {field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Subscription (Optional)</Label>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger className={isEditMode ? 'h-8 text-xs' : ''}>
                  <SelectValue placeholder="Link to a subscription" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubscriptions.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      <div className="flex gap-4">
        <form.Field name="vendor_id">
          {field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Vendor (Optional)</Label>
              <VendorSelector
                value={field.state.value || ''}
                onValueChange={field.handleChange}
                vendors={availableVendors}
                placeholder="Select a vendor"
                size={isEditMode ? 'sm' : 'default'}
                className={isEditMode ? 'text-xs' : ''}
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-3">
        {isEditMode && (
          <div className="flex items-center gap-1 p-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600 h-10">
            <span className="font-medium">{getPaymentMethodLabel()}:</span>
            <span>{getAccountDisplayName()}</span>
            <span className="text-xs text-gray-500">(locked)</span>
          </div>
        )}
        <div className="flex flex-col mb-2">
          <Label htmlFor="credit-card-toggle">Bank Account</Label>
          <form.Field
            name="account_id"
            validators={{
              onChange: transactionSchema.shape.account_id,
            }}
          >
            {field => (
              <div className="flex gap-2 justify-between flex-nowrap overflow-x-auto">
                {accounts?.map(account => (
                  <div
                    className={cn(
                      'gap-2 px-4 py-4 border rounded-lg bg-gray-100',
                      field.state.value === account.id && 'bg-primary text-primary-foreground'
                    )}
                    key={account.id}
                    onClick={() => field.handleChange(account.id)}
                  >
                    {account.name}
                  </div>
                ))}
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((error: any) =>
                        typeof error === 'string' ? error : error?.message || JSON.stringify(error)
                      )
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col mb-2">
          <Label htmlFor="credit-card-toggle">Credit Card</Label>

          <form.Field
            name="credit_card_id"
            validators={{
              onChange: transactionSchema.shape.credit_card_id,
            }}
          >
            {field => (
              <div className="mt-6">
                <div className="flex gap-2 justify-between flex-nowrap overflow-x-auto">
                  {creditCards?.data?.map(creditCard => (
                    <div
                      className={cn(
                        'gap-2 px-4 py-4 border rounded-lg bg-gray-100',
                        field.state.value === creditCard.id && 'bg-primary text-primary-foreground'
                      )}
                      key={creditCard.id}
                      onClick={() => field.handleChange(creditCard.id)}
                    >
                      {creditCard.name} (*{creditCard.last_four_digits})
                    </div>
                  ))}
                  {creditCards?.data?.length === 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">No credit cards</div>
                  )}
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((error: any) =>
                        typeof error === 'string' ? error : error?.message || JSON.stringify(error)
                      )
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="flex  gap-6">
        <form.Field name="is_paid">
          {field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Payment Status</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={value => field.handleChange(value)}
                />
                <label htmlFor={field.name} className="text-sm text-muted-foreground">
                  {field.state.value ? 'Paid' : 'Unpaid'}
                </label>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="ignored">
          {field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Ignore Transaction</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={value => field.handleChange(value)}
                />
                <label htmlFor={field.name} className="text-sm text-muted-foreground">
                  {field.state.value ? 'Ignored' : 'Active'}
                </label>
              </div>
            </div>
          )}
        </form.Field>
      </div>
    </form>
  );
};
