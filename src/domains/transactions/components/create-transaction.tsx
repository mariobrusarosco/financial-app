import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
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

const CreateTransaction = () => {
  const { data: brokers, isFetching } = useBrokers();
  const { mutate: createTransaction } = useCreateTransaction();
  const { data: accounts } = useAccounts();
  const [isUsingCreditCard, setIsUsingCreditCard] = useState<boolean>(false);
  const { data: creditCards } = useCreditCards(undefined); // Get all credit cards

  const form = useForm({
    defaultValues: {
      description: '',
      amount: null,
      date: new Date().toISOString().split('T')[0], // Today's date
      account_id: '',
      broker_id: '',
      credit_card_id: '',
      is_paid: false,
      type: 'expense',
    } as I_CreateTransactionForm,
    onSubmit: ({ value }) => {
      void createTransaction(value);
    },
  });

  if (isFetching)
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
        className="space-y-6 grid grid-cols-4 gap-10"
      >
        <div className="flex flex-col gap-4">
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => (!value ? 'Description is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-2">
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

          <div className="flex gap-4">
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
                    onChange={e => field.handleChange(e.target.valueAsNumber || null)}
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
              validators={{
                onChange: ({ value }) => (!value ? 'Date is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Date:
                  </label>

                  <TransactionDatePicker date={field.state.value} setDate={field.handleChange} />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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

          {/* Account/Credit Card Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Payment Method:</label>
            <div className="flex items-center space-x-3">
              <Switch
                id="credit-card-toggle"
                checked={isUsingCreditCard}
                onCheckedChange={checked => {
                  setIsUsingCreditCard(checked);
                  // Clear the opposite field when switching
                  if (checked) {
                    form.setFieldValue('account_id', '');
                  } else {
                    form.setFieldValue('credit_card_id', '');
                  }
                }}
              />
              <Label htmlFor="credit-card-toggle">
                {isUsingCreditCard ? 'Credit Card' : 'Account'}
              </Label>
            </div>
          </div>

          {/* Conditional Account or Credit Card Selection */}
          {!isUsingCreditCard ? (
            <form.Field
              name="account_id"
              validators={{
                onChange: ({ value }) =>
                  !isUsingCreditCard && !value ? 'Account is required' : undefined,
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
                  isUsingCreditCard && !value ? 'Credit card is required' : undefined,
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
        </div>
      </form>
    </div>
  );
};

export default CreateTransaction;
