import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { useMemo } from 'react';
import type { I_TransactionPayload, T_TransactionType } from '../types/types-and-interfaces';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useVendors } from '@/domains/vendors/hooks';
import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { Label } from '@/domains/ui-system/components/label';
import { Switch } from '@/domains/ui-system/components/switch';
import { Textarea } from '@/domains/ui-system/components/textarea';
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

const MOVEMENT_TYPE_OPTIONS: { value: T_TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'investment', label: 'Investment' },
  { value: 'transfer', label: 'Transfer' },
];

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

type TransactionFormApi = ReturnType<typeof useForm>;
type AccountsData = ReturnType<typeof useAccounts>['data'];
type AccountOption = NonNullable<AccountsData>[number];
type CreditCardsData = ReturnType<typeof useCreditCards>['data'];
type CreditCardOption = NonNullable<NonNullable<CreditCardsData>['data']>[number];
type VendorsData = ReturnType<typeof useVendors>['data'];
type VendorOption = NonNullable<NonNullable<VendorsData>['data']>[number];
type SubscriptionsData = ReturnType<typeof useSubscriptions>['data'];
type SubscriptionOption = NonNullable<NonNullable<SubscriptionsData>['data']>[number];

export const TransactionForm = ({
  initialValues,
  onSubmit,
  isEditMode = false,
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
  const accountList = accounts || [];
  const creditCardList = creditCards?.data || [];

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

  const accountDisplayName = getAccountDisplayName(initialValues, accountList, creditCardList);
  const paymentMethodLabel = initialValues?.credit_card_id ? 'Credit Card' : 'Account';

  return (
    <form
      id="transaction-form"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-6 p-2 md:p-6 "
    >
      <div className="flex flex-wrap gap-6 ">
        <DescriptionField form={form} isEditMode={isEditMode} />
        <AmountField form={form} isEditMode={isEditMode} />
        <DateField form={form} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <MovementTypeField form={form} />
          <CategoryField form={form} isEditMode={isEditMode} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <SubscriptionField
            form={form}
            isEditMode={isEditMode}
            availableSubscriptions={availableSubscriptions}
          />
          <VendorField form={form} isEditMode={isEditMode} availableVendors={availableVendors} />
        </div>
      </div>

      {isEditMode && (
        <PaymentMethodLockInfo
          paymentMethodLabel={paymentMethodLabel}
          accountDisplayName={accountDisplayName}
        />
      )}
      <BankAccountField form={form} accounts={accountList} />
      <CreditCardField form={form} creditCards={creditCardList} />

      <div className="flex flex-col md:flex-row gap-6">
        <IsPaidField form={form} />
        <IgnoredField form={form} />
      </div>
    </form>
  );
};

const DescriptionField = ({
  form,
  isEditMode,
}: {
  form: TransactionFormApi;
  isEditMode: boolean;
}) => (
  <form.Field
    name="description"
    validators={{
      onChange: transactionSchema.shape.description,
    }}
  >
    {field => (
      <div className="space-y-2 w-full md:w-auto">
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
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const AmountField = ({ form, isEditMode }: { form: TransactionFormApi; isEditMode: boolean }) => (
  <form.Field
    name="amount"
    validators={{
      onSubmit: transactionSchema.shape.amount,
    }}
  >
    {field => <TransactionAmountField field={field} isEditMode={isEditMode} />}
  </form.Field>
);

const DateField = ({ form }: { form: TransactionFormApi }) => (
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
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const MovementTypeField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field
    name="movement_type"
    validators={{
      onChange: transactionSchema.shape.movement_type,
    }}
  >
    {field => (
      <div className="space-y-3">
        <Label>Movement Type</Label>
        <div className="flex gap-2 flex-nowrap overflow-x-auto">
          {MOVEMENT_TYPE_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => field.handleChange(option.value)}
              className={cn(
                'gap-2 px-2.5 py-2.5 text-xs md:text-sm border rounded-lg bg-gray-100 min-w-fit whitespace-nowrap',
                {
                  'bg-primary text-primary-foreground': field.state.value === option.value,
                }
              )}
              aria-pressed={field.state.value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const CategoryField = ({ form, isEditMode }: { form: TransactionFormApi; isEditMode: boolean }) => (
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
);

const SubscriptionField = ({
  form,
  isEditMode,
  availableSubscriptions,
}: {
  form: TransactionFormApi;
  isEditMode: boolean;
  availableSubscriptions: SubscriptionOption[];
}) => (
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
);

const VendorField = ({
  form,
  isEditMode,
  availableVendors,
}: {
  form: TransactionFormApi;
  isEditMode: boolean;
  availableVendors: VendorOption[];
}) => (
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
);

const PaymentMethodLockInfo = ({
  paymentMethodLabel,
  accountDisplayName,
}: {
  paymentMethodLabel: string;
  accountDisplayName: string;
}) => (
  <div className="flex items-center gap-1 p-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600 h-10">
    <span className="font-medium">{paymentMethodLabel}:</span>
    <span>{accountDisplayName}</span>
    <span className="text-xs text-gray-500">(locked)</span>
  </div>
);

const BankAccountField = ({
  form,
  accounts,
}: {
  form: TransactionFormApi;
  accounts: AccountOption[];
}) => (
  <div className="flex flex-col mb-2 space-y-2">
    <Label htmlFor="credit-card-toggle">Bank Account</Label>
    <form.Field
      name="account_id"
      validators={{
        onChange: transactionSchema.shape.account_id,
      }}
    >
      {field => (
        <div className="flex gap-2 overflow-x-auto w-full">
          {accounts.map(account => (
            <div
              className={cn(
                'whitespace-nowrap w-fit gap-2 px-2.5 py-2.5 text-xs md:text-sm border rounded-lg bg-gray-100',
                field.state.value === account.id && 'bg-primary text-primary-foreground'
              )}
              key={account.id}
              onClick={() => {
                field.handleChange(account.id);
                form.setFieldValue('credit_card_id', '');
              }}
            >
              {account.name}
            </div>
          ))}
          <FieldErrors errors={field.state.meta.errors} />
        </div>
      )}
    </form.Field>
  </div>
);

const CreditCardField = ({
  form,
  creditCards,
}: {
  form: TransactionFormApi;
  creditCards: CreditCardOption[];
}) => (
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
          <div className="flex gap-2 flex-nowrap overflow-x-auto">
            {creditCards.map(creditCard => (
              <div
                className={cn(
                  'gap-2 px-2.5 py-2.5 text-xs md:text-sm border rounded-lg bg-gray-100 min-w-fit whitespace-nowrap',
                  { 'bg-primary text-primary-foreground': field.state.value === creditCard.id }
                )}
                key={creditCard.id}
                onClick={() => {
                  field.handleChange(creditCard.id);
                  form.setFieldValue('account_id', '');
                }}
              >
                {creditCard.name} (*{creditCard.last_four_digits})
              </div>
            ))}
            {creditCards.length === 0 && (
              <div className="mt-2 text-sm text-muted-foreground">No credit cards</div>
            )}
          </div>
          <FieldErrors errors={field.state.meta.errors} />
        </div>
      )}
    </form.Field>
  </div>
);

const IsPaidField = ({ form }: { form: TransactionFormApi }) => (
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
);

const IgnoredField = ({ form }: { form: TransactionFormApi }) => (
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
);

const FieldErrors = ({ errors }: { errors: unknown[] }) => {
  if (errors.length === 0) return null;

  return <p className="text-sm text-destructive">{errors.map(getFieldErrorMessage).join(', ')}</p>;
};

const getFieldErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }

  const serializedError = JSON.stringify(error);
  return serializedError === undefined ? String(error) : serializedError;
};

const getAccountDisplayName = (
  initialValues: Partial<I_TransactionPayload> | undefined,
  accounts: AccountOption[],
  creditCards: CreditCardOption[]
): string => {
  if (initialValues?.credit_card_id) {
    const card = creditCards.find(c => c.id === initialValues.credit_card_id);
    return card ? `${card.name} (*${card.last_four_digits})` : 'Credit Card';
  }

  const account = accounts.find(a => a.id === initialValues?.account_id);
  return account?.name || 'Account';
};
