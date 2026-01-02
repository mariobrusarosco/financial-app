import { useForm } from '@tanstack/react-form';
import { useState, useMemo } from 'react';
import type { I_CreateTransactionForm, T_TransactionType } from '../types/types-and-interfaces';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useCreateTransaction } from '@/domains/transactions/hooks/use-create-transaction';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { Switch } from '@/domains/ui-system/components/switch';
import { RadioGroup, RadioGroupItem } from '@/domains/ui-system/components/radio-group';
import { Label } from '@/domains/ui-system/components/label';
import { TransactionDatePicker } from './transaction-date-picker';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { Textarea } from '@/domains/ui-system/components/textarea';
import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { HierarchicalCategorySelector } from '@/domains/transactions/components/hierarchical-category-selector';

interface CreateTransactionProps {
  onAddTransaction?: (transaction: I_CreateTransactionForm) => void;
}

const CreateTransaction = ({ onAddTransaction }: CreateTransactionProps) => {
  const { mutate: createTransaction } = useCreateTransaction();
  const { data: accounts, isFetching: isFetchingAccounts } = useAccounts();
  const [transactionSource, setTransactionSource] = useState<'account' | 'creditCard'>('account');
  const { data: creditCards, isFetching: isFetchingCreditCards } = useCreditCards();
  const { data: subscriptionsData, isFetching: isFetchingSubscriptions } = useSubscriptions({
    is_active: true,
  });

  const availableSubscriptions = useMemo(() => subscriptionsData?.data || [], [subscriptionsData]);

  const form = useForm<I_CreateTransactionForm>({
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      account_id: '',
      credit_card_id: '',
      broker_id: '',
      is_paid: false,
      ignored: false,
      type: 'expense',
      category: '',
      subscription_id: '',
    },
    onSubmit: ({ value }) => {
      const completeTransaction: I_CreateTransactionForm = {
        ...value,
        broker_id: getBrokerId() || '',
        subscription_id: value.subscription_id === '' ? undefined : value.subscription_id,
      };

      if (onAddTransaction) {
        onAddTransaction(completeTransaction);
        form.reset();
        setTransactionSource('account');
      } else {
        void createTransaction(completeTransaction);
      }
    },
  });

  const getBrokerId = () => {
    if (transactionSource === 'creditCard') {
      return creditCards?.data?.find(card => card.id === form.state.values.credit_card_id)
        ?.broker_id;
    }
    return accounts?.find(account => account.id === form.state.values.account_id)?.broker?.id;
  };

  if (isFetchingAccounts || isFetchingCreditCards || isFetchingSubscriptions)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <form
        id="transaction-create-form"
        onSubmit={e => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="flex gap-4">
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => (!value ? 'Description is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-2 min-w-[250px]">
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  Description:
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Enter transaction description"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => (value === 0 ? 'Amount is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  Amount:
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="date"
            validators={{ onChange: ({ value }) => (!value ? 'Date is required' : undefined) }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  Date:
                </label>
                <TransactionDatePicker
                  date={field.state.value ? new Date(field.state.value) : undefined}
                  setDate={date => field.handleChange(date ? date.toISOString().split('T')[0] : '')}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="flex gap-4">
          <form.Field
            name="type"
            validators={{
              onChange: ({ value }) => (!value ? 'Transaction type is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Movement Type:</label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={value => field.handleChange(value as T_TransactionType)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Income</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investment" id="investment" />
                    <Label htmlFor="investment">Investment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">Transfer</Label>
                  </div>
                </RadioGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="category">
            {field => (
              <form.Subscribe
                selector={state => state.values.type}
                children={currentType => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <HierarchicalCategorySelector
                      value={field.state.value || ''}
                      onValueChange={field.handleChange}
                      placeholder="Select category..."
                      className="w-full"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              />
            )}
          </form.Field>

          <form.Field name="subscription_id">
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Subscription (Optional)</Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger>
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
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Payment Method:</label>
            <div className="flex items-center space-x-3">
              <Switch
                id="credit-card-toggle"
                checked={transactionSource === 'creditCard'}
                onCheckedChange={checked => {
                  form.setFieldValue('account_id', '');
                  form.setFieldValue('credit_card_id', '');
                  setTransactionSource(checked ? 'creditCard' : 'account');
                }}
              />
              <Label htmlFor="credit-card-toggle">
                {transactionSource === 'creditCard' ? 'Credit Card' : 'Account'}
              </Label>
            </div>
          </div>
          {transactionSource === 'account' ? (
            <form.Field
              name="account_id"
              validators={{
                onChange: ({ value }) =>
                  transactionSource === 'account' && !value ? 'Account is required' : undefined,
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Account:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          ) : (
            <form.Field
              name="credit_card_id"
              validators={{
                onChange: ({ value }) =>
                  transactionSource === 'creditCard' && !value
                    ? 'Credit card is required'
                    : undefined,
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Credit Card:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a credit card" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditCards?.data?.map(creditCard => (
                        <SelectItem key={creditCard.id} value={creditCard.id}>
                          {creditCard.name} (*{creditCard.last_four_digits})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          )}
          <form.Field name="is_paid">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  Payment Status:
                </label>
                <div className="flex items-center space-x-2">
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
                <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                  Ignore Transaction:
                </label>
                <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default CreateTransaction;
