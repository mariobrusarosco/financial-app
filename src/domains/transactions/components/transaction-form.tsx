import { useForm, useStore } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import type {
  I_CreateTransactionForm,
  I_TransactionPayload,
  T_TransactionType,
} from '../types/types-and-interfaces';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useVendors } from '@/domains/vendors/hooks';
import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { Label } from '@/domains/ui-system/components/label';
import { Switch } from '@/domains/ui-system/components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { TransactionDatePicker } from './transaction-date-picker';
import { TagSelector } from '@/domains/tags/components/tag-selector';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { VendorSelector } from '@/domains/vendors/components/vendor-selector';
import { Input } from '@/domains/ui-system/components/input';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { Calculator as CalculatorIcon, ChevronDown, CreditCard, Landmark } from 'lucide-react';
import { Calculator } from '@/domains/ui-system/components/calculator';
import { cn } from '@/domains/ui-system';

const MOVEMENT_TYPE_OPTIONS: {
  value: T_TransactionType;
  label: string;
  selectedClassName: string;
  idleClassName: string;
}[] = [
  {
    value: 'expense',
    label: 'Expense',
    selectedClassName: 'bg-destructive text-white border-destructive',
    idleClassName:
      'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15',
  },
  {
    value: 'income',
    label: 'Income',
    selectedClassName: 'bg-positive text-white border-positive',
    idleClassName: 'bg-positive/10 text-positive border-positive/30 hover:bg-positive/15',
  },
  {
    value: 'investment',
    label: 'Investment',
    selectedClassName: 'bg-brand text-brand-foreground border-brand',
    idleClassName: 'bg-brand/10 text-brand border-brand/30 hover:bg-brand/15',
  },
  {
    value: 'transfer',
    label: 'Transfer',
    selectedClassName: 'bg-warning text-white border-warning',
    idleClassName: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/15',
  },
];

const SELECTED_OPTION_CLASS_NAME =
  'bg-primary text-primary-foreground border-transparent shadow-sm';

const transactionSchema = z
  .object({
    description: z.string().min(1, 'Description is required'),
    amount: z.preprocess(
      val => {
        if (val === '' || val === null || val === undefined) return undefined;
        if (typeof val === 'string') {
          const normalized = val.replace(',', '.');
          const num = Number(normalized);
          return isNaN(num) ? val : num;
        }
        return Number(val);
      },
      z
        .number({ message: 'Amount is required' })
        .refine(val => val !== 0, 'Amount must not be 0')
    ),
    date: z.string().min(1, 'Date is required'),
    movement_type: z.enum(['expense', 'income', 'investment', 'transfer'] as const),
    tag_ids: z.array(z.string()).max(20, 'A transaction can have at most 20 tags'),
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
  })
  .refine(data => !(data.account_id && data.credit_card_id), {
    message: 'Choose either Bank Account or Credit Card',
    path: ['credit_card_id'],
  });

interface TransactionFormProps {
  initialValues?: Partial<I_TransactionPayload> & {
    id?: string;
    subscription_id?: string;
    tags?: I_Tag[];
  };
  onSubmit: (values: I_CreateTransactionForm) => void;
  isEditMode?: boolean;
  onCancel?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

type TransactionFormApi = any;
type AccountsData = ReturnType<typeof useAccounts>['accounts']['query']['data'];
type AccountOption = NonNullable<AccountsData>['accounts'][number];
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
  onDirtyChange,
}: TransactionFormProps) => {
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const { data: creditCards, isPending: isPendingCreditCards } = useCreditCards(undefined);
  const { data: vendorsData, isPending: isPendingVendors } = useVendors({ per_page: 100 });
  const { data: subscriptionsData, isPending: isPendingSubscriptions } = useSubscriptions({
    is_active: true,
  });

  const availableVendors = vendorsData?.data || [];
  const availableSubscriptions = useMemo(() => subscriptionsData?.data || [], [subscriptionsData]);
  const accountList = accountsQuery.data?.accounts ?? [];
  const creditCardList = creditCards?.data || [];
  const paymentMethodDefaults = getPaymentMethodDefaults(initialValues, isEditMode);

  const [destinationType, setDestinationType] = useState<'account' | 'credit_card'>(
    paymentMethodDefaults.credit_card_id ? 'credit_card' : 'account'
  );
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      description: initialValues?.description || '',
      amount: initialValues?.amount
        ? String(initialValues.amount).replace('.', ',')
        : '',
      date: initialValues?.date || new Date().toISOString().split('T')[0],
      movement_type: initialValues?.movement_type || 'expense',
      tag_ids: initialValues?.tag_ids ?? [],
      account_id: paymentMethodDefaults.account_id,
      credit_card_id: paymentMethodDefaults.credit_card_id,
      vendor_id: initialValues?.vendor_id || '',
      subscription_id: initialValues?.subscription_id || '',
      is_paid: initialValues?.is_paid ?? true,
      ignored: initialValues?.ignored ?? false,
    },
    onSubmit: ({ value }) => {
      const paymentMethod = getSubmissionPaymentMethod(value);
      const parsedAmount =
        typeof value.amount === 'string'
          ? Number(value.amount.replace(',', '.'))
          : Number(value.amount);

      const submissionData: I_CreateTransactionForm = {
        description: value.description,
        amount: parsedAmount,
        date: value.date,
        movement_type: value.movement_type,
        tag_ids: value.tag_ids,
        account_id: paymentMethod.account_id,
        credit_card_id: paymentMethod.credit_card_id,
        vendor_id: value.vendor_id || undefined,
        is_paid: value.is_paid,
        ignored: value.ignored,
      };

      if (value.subscription_id) {
        submissionData.subscription_id = value.subscription_id;
      }

      const broker_id =
        creditCards?.data?.find(c => c.id === paymentMethod.credit_card_id)?.broker_id ||
        accountList.find(a => a.id === paymentMethod.account_id)?.broker?.id;

      if (broker_id) {
        submissionData.broker_id = broker_id;
      }

      onSubmit(submissionData);
    },
  } as any);

  const isDirty = useStore(form.store, state =>
    hasChangedValues(
      state.values as Record<string, unknown>,
      form.options.defaultValues as Record<string, unknown> | undefined
    )
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // isPending (not isFetching): background refetches must not unmount the form and drop edits
  if (
    accountsQuery.isPending ||
    isPendingCreditCards ||
    isPendingVendors ||
    isPendingSubscriptions
  ) {
    return <TransactionFormSkeleton />;
  }

  const handleDestinationTypeChange = (type: 'account' | 'credit_card') => {
    setDestinationType(type);
    if (type === 'account') {
      form.setFieldValue('credit_card_id', '');
      const currentAccountId = form.getFieldValue('account_id');
      if (!currentAccountId && accountList.length > 0) {
        form.setFieldValue('account_id', accountList[0].id);
      }
    } else {
      form.setFieldValue('account_id', '');
      const currentCardId = form.getFieldValue('credit_card_id');
      if (!currentCardId && creditCardList.length > 0) {
        form.setFieldValue('credit_card_id', creditCardList[0].id);
      }
    }
  };

  return (
    <form
      id="transaction-form"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {/* SECTION 1: CORE DETAILS */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
          CORE DETAILS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <AmountField form={form} />
          <DateField form={form} />
        </div>
        <DescriptionField form={form} />
      </div>

      <div className="border-b border-border/70" />

      {/* SECTION 2: CLASSIFICATION */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
          CLASSIFICATION
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <MovementTypeField form={form} />
          <TagField form={form} historicalTags={initialValues?.tags} />
        </div>
      </div>

      <div className="border-b border-border/70" />

      {/* SECTION 3: DESTINATION */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
          DESTINATION
        </div>
        {/* Segmented Control */}
        <div className="bg-muted p-1 rounded-xl flex gap-1 w-full">
          <button
            type="button"
            onClick={() => handleDestinationTypeChange('account')}
            aria-pressed={destinationType === 'account'}
            className={cn(
              'flex-1 py-1.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
              destinationType === 'account'
                ? SELECTED_OPTION_CLASS_NAME
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Landmark className="h-4 w-4" /> Bank Account
          </button>
          <button
            type="button"
            onClick={() => handleDestinationTypeChange('credit_card')}
            aria-pressed={destinationType === 'credit_card'}
            className={cn(
              'flex-1 py-1.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
              destinationType === 'credit_card'
                ? SELECTED_OPTION_CLASS_NAME
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <CreditCard className="h-4 w-4" /> Credit Card
          </button>
        </div>

        {/* Account / Card Selectors */}
        {destinationType === 'account' ? (
          <BankAccountSelector form={form} accounts={accountList} />
        ) : (
          <CreditCardSelector form={form} creditCards={creditCardList} />
        )}
      </div>

      <div className="border-b border-border/70" />

      {/* SECTION 4: OPTIONAL */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(prev => !prev)}
          aria-expanded={isOptionalOpen}
          aria-controls="transaction-form-optional"
          className="flex w-full items-center justify-between cursor-pointer py-1 select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
            OPTIONAL
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
              isOptionalOpen && 'rotate-180'
            )}
          />
        </button>

        {isOptionalOpen && (
          <div id="transaction-form-optional" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <SubscriptionField
              form={form}
              isEditMode={isEditMode}
              availableSubscriptions={availableSubscriptions}
            />
            <VendorField
              form={form}
              isEditMode={isEditMode}
              availableVendors={availableVendors}
            />
          </div>
        )}
      </div>

      <div className="border-b border-border/70" />

      {/* SECTION 5: STATUS */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
          STATUS
        </div>
        <div className="flex items-center gap-8 py-1">
          <IsPaidField form={form} />
          <IgnoredField form={form} />
        </div>
      </div>
    </form>
  );
};

/* Core Details Subcomponents */

const AmountField = ({ form }: { form: TransactionFormApi }) => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <form.Field
      name="amount"
      validators={{
        onSubmit: transactionSchema.shape.amount,
      }}
    >
      {(field: any) => (
        <div className="space-y-1.5 relative">
          <Label htmlFor={field.name} className="text-xs font-normal text-muted-foreground">
            Amount
          </Label>
          <div className="relative flex items-center border-2 border-foreground/90 dark:border-foreground/70 rounded-xl px-3 py-1 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 h-11">
            <span className="text-muted-foreground font-medium text-sm pl-0.5 pr-1.5 select-none shrink-0">
              R$
            </span>
            <input
              id={field.name}
              type="text"
              inputMode="decimal"
              value={String(field.state.value ?? '')}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              className="text-xl font-bold tracking-tight bg-transparent border-0 p-0 focus:outline-none w-full text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-1 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground transition-colors shrink-0 ml-2"
              title="Calculator"
            >
              <CalculatorIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {showCalculator && (
            <div className="absolute right-0 top-full mt-2 z-50 shadow-xl bg-background rounded-xl border p-2">
              <Calculator
                initialValue={
                  field.state.value
                    ? Number(String(field.state.value).replace(',', '.'))
                    : undefined
                }
                onApply={value => {
                  field.handleChange(value.toString().replace('.', ','));
                  setShowCalculator(false);
                }}
                onClose={() => setShowCalculator(false)}
                className="w-[280px]"
              />
            </div>
          )}
          <FieldErrors errors={field.state.meta.errors} />
        </div>
      )}
    </form.Field>
  );
};

const DateField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field
    name="date"
    validators={{
      onChange: transactionSchema.shape.date,
    }}
  >
    {(field: any) => (
      <div className="space-y-1.5">
        <Label htmlFor={field.name} className="text-xs font-normal text-muted-foreground">
          Date
        </Label>
        <TransactionDatePicker
          date={field.state.value ? new Date(String(field.state.value)) : undefined}
          setDate={date => field.handleChange(date ? date.toISOString().split('T')[0] : '')}
          className="h-11 rounded-xl border-border/80 font-medium"
        />
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const DescriptionField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field
    name="description"
    validators={{
      onChange: transactionSchema.shape.description,
    }}
  >
    {(field: any) => (
      <div className="space-y-1 w-full">
        <Input
          id={field.name}
          value={String(field.state.value ?? '')}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          placeholder="Enter transaction description"
          className="h-10 rounded-xl border-input px-3.5 text-sm bg-background w-full focus-visible:ring-1"
        />
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

/* Classification Subcomponents */

const MovementTypeField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field
    name="movement_type"
    validators={{
      onChange: transactionSchema.shape.movement_type,
    }}
  >
    {(field: any) => (
      <div className="flex gap-2 flex-wrap items-center">
        {MOVEMENT_TYPE_OPTIONS.map(option => {
          const isSelected = field.state.value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => field.handleChange(option.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer',
                isSelected ? cn(option.selectedClassName, 'shadow-sm') : option.idleClassName
              )}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          );
        })}
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const TagField = ({
  form,
  historicalTags,
}: {
  form: TransactionFormApi;
  historicalTags?: I_Tag[];
}) => (
  <form.Field name="tag_ids">
    {(field: any) => (
      <div className="min-w-[15rem] flex-1 space-y-1.5">
        <Label className="block text-xs font-normal text-muted-foreground">Tags</Label>
        <TagSelector
          value={Array.isArray(field.state.value) ? field.state.value : []}
          onValueChange={field.handleChange}
          historicalTags={historicalTags}
          placeholder="Select tags…"
          className="rounded-xl border-input"
        />
      </div>
    )}
  </form.Field>
);

/* Destination Subcomponents */

const BankAccountSelector = ({
  form,
  accounts,
}: {
  form: TransactionFormApi;
  accounts: AccountOption[];
}) => (
  <form.Field
    name="account_id"
    validators={{
      onChange: transactionSchema.shape.account_id,
    }}
  >
    {(field: any) => (
      <div>
        <div className="flex gap-2 flex-wrap overflow-x-auto w-full">
          {accounts.map(account => {
            const isSelected = field.state.value === account.id;
            return (
              <button
                type="button"
                key={account.id}
                onClick={() => {
                  field.handleChange(account.id);
                  form.setFieldValue('credit_card_id', '');
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border select-none',
                  isSelected
                    ? SELECTED_OPTION_CLASS_NAME
                    : 'border-border/80 bg-background text-foreground hover:bg-muted/50'
                )}
              >
                {account.name}
              </button>
            );
          })}
          {accounts.length === 0 && (
            <p className="text-sm text-muted-foreground">No bank accounts available</p>
          )}
        </div>
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

const CreditCardSelector = ({
  form,
  creditCards,
}: {
  form: TransactionFormApi;
  creditCards: CreditCardOption[];
}) => (
  <form.Field
    name="credit_card_id"
    validators={{
      onChange: transactionSchema.shape.credit_card_id,
    }}
  >
    {(field: any) => (
      <div>
        <div className="flex gap-2 flex-wrap overflow-x-auto w-full">
          {creditCards.map(creditCard => {
            const isSelected = field.state.value === creditCard.id;
            return (
              <button
                type="button"
                key={creditCard.id}
                onClick={() => {
                  field.handleChange(creditCard.id);
                  form.setFieldValue('account_id', '');
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border select-none',
                  isSelected
                    ? SELECTED_OPTION_CLASS_NAME
                    : 'border-border/80 bg-background text-foreground hover:bg-muted/50'
                )}
              >
                {creditCard.name} (*{creditCard.last_four_digits})
              </button>
            );
          })}
          {creditCards.length === 0 && (
            <p className="text-sm text-muted-foreground">No credit cards available</p>
          )}
        </div>
        <FieldErrors errors={field.state.meta.errors} />
      </div>
    )}
  </form.Field>
);

/* Optional Subcomponents */

const SubscriptionField = ({
  form,
  isEditMode: _isEditMode,
  availableSubscriptions,
}: {
  form: TransactionFormApi;
  isEditMode: boolean;
  availableSubscriptions: SubscriptionOption[];
}) => (
  <form.Field name="subscription_id">
    {(field: any) => (
      <div className="space-y-1.5">
        <Label htmlFor={field.name} className="text-xs font-normal text-muted-foreground">
          Subscription
        </Label>
        <Select value={String(field.state.value || '')} onValueChange={field.handleChange}>
          <SelectTrigger className="rounded-xl h-10 border-input">
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
    {(field: any) => (
      <div className="space-y-1.5">
        <Label htmlFor={field.name} className="text-xs font-normal text-muted-foreground">
          Vendor
        </Label>
        <VendorSelector
          value={String(field.state.value || '')}
          onValueChange={field.handleChange}
          vendors={availableVendors}
          placeholder="Select a vendor"
          size={isEditMode ? 'sm' : 'default'}
          className="rounded-xl h-10 border-input w-full"
        />
      </div>
    )}
  </form.Field>
);

/* Status Subcomponents */

const IsPaidField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field name="is_paid">
    {(field: any) => (
      <div className="flex items-center gap-3">
        <Switch
          id={field.name}
          checked={Boolean(field.state.value)}
          onCheckedChange={value => field.handleChange(value)}
        />
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-foreground cursor-pointer select-none"
        >
          Payment Status
        </label>
      </div>
    )}
  </form.Field>
);

const IgnoredField = ({ form }: { form: TransactionFormApi }) => (
  <form.Field name="ignored">
    {(field: any) => (
      <div className="flex items-center gap-3">
        <Switch
          id={field.name}
          checked={Boolean(field.state.value)}
          onCheckedChange={value => field.handleChange(value)}
        />
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-foreground cursor-pointer select-none"
        >
          Ignore Transaction
        </label>
      </div>
    )}
  </form.Field>
);

const TransactionFormSkeleton = () => (
  <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading transaction form">
    <div className="space-y-3">
      <Skeleton className="h-3 w-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
      <Skeleton className="h-10 rounded-xl" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-28" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-11 rounded-xl" />
    </div>
  </div>
);

const hasChangedValues = (
  values: Record<string, unknown>,
  defaultValues: Record<string, unknown> | undefined
) =>
  Object.keys(defaultValues ?? {}).some(
    key => JSON.stringify(values[key]) !== JSON.stringify(defaultValues?.[key])
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

const getPaymentMethodDefaults = (
  initialValues: Partial<I_TransactionPayload> | undefined,
  isEditMode: boolean
) => {
  if (initialValues?.credit_card_id) {
    return {
      account_id: '',
      credit_card_id: initialValues.credit_card_id,
    };
  }

  return {
    account_id: initialValues?.account_id || '',
    credit_card_id: isEditMode ? '' : initialValues?.credit_card_id || '',
  };
};

const getSubmissionPaymentMethod = ({
  account_id,
  credit_card_id,
}: {
  account_id?: string;
  credit_card_id?: string;
}) => {
  if (credit_card_id) {
    return {
      account_id: undefined,
      credit_card_id,
    };
  }

  if (account_id) {
    return {
      account_id,
      credit_card_id: undefined,
    };
  }

  return {
    account_id: undefined,
    credit_card_id: undefined,
  };
};
