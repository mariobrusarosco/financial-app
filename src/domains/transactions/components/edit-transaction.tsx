import { useForm } from '@tanstack/react-form';
import type { I_TransactionResponse, T_TransactionType } from '../types/types-and-interfaces';

import { Input } from '@/domains/ui-system/components/input';
import { Button } from '@/domains/ui-system/components/button';
import { RadioGroup, RadioGroupItem } from '@/domains/ui-system/components/radio-group';
import { Label } from '@/domains/ui-system/components/label';
import { Switch } from '@/domains/ui-system/components/switch';
import { Textarea } from '@/domains/ui-system/components/textarea';
import { TransactionDatePicker } from './transaction-date-picker';
import { HierarchicalCategorySelector } from './hierarchical-category-selector';
import { Save, X } from 'lucide-react';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';

interface EditTransactionProps {
  transaction: I_TransactionResponse;
  onSave: (updates: Partial<I_TransactionResponse>) => void;
  onCancel: () => void;
}

export const EditTransaction = ({ transaction, onSave, onCancel }: EditTransactionProps) => {
  const { data: accounts } = useAccounts();
  const { data: creditCards } = useCreditCards(undefined);

  const form = useForm({
    defaultValues: {
      ...transaction,
      amount: transaction.amount.toString(),
    },
    onSubmit: ({ value }) => {
      const updates: Partial<I_TransactionResponse> = {};

      // Generic shallow diff: Compare current values with initial transaction
      Object.keys(value).forEach(key => {
        const field = key as keyof I_TransactionResponse;

        // We compare the value in the form with the original transaction value
        // Note: amount is converted to string for the form, so we compare strings
        if (String(value[field]) !== String((transaction as any)[field])) {
          (updates as any)[field] = value[field];
        }
      });

      if (Object.keys(updates).length > 0) {
        onSave(updates);
      } else {
        onCancel(); // Nothing actually changed
      }
    },
  });

  // Determine display info for locked fields
  const getAccountDisplayName = () => {
    if (transaction.credit_card_id) {
      const card = creditCards?.data?.find(c => c.id === transaction.credit_card_id);
      return card ? `${card.name} (*${card.last_four_digits})` : 'Credit Card';
    }
    const account = accounts?.find(a => a.id === transaction.account_id);
    return account?.name || 'Account';
  };

  const getPaymentMethodLabel = () => {
    return transaction.credit_card_id ? 'Credit Card' : 'Account';
  };

  return (
    <div className="rounded-lg p-4 space-y-4">
      <form
        id="edit-transaction-form"
        onSubmit={e => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex gap-4">
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => (!value ? 'Description is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-1 min-w-[250px]">
                <label htmlFor={field.name} className="text-xs font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => (!value || value === '0' ? 'Amount is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-1">
                <label htmlFor={field.name} className="text-xs font-medium text-gray-700">
                  Amount
                </label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  type="text"
                  className="text-sm"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-4">
          <form.Field
            name="date"
            validators={{
              onChange: ({ value }) => (!value ? 'Date is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-1">
                <label htmlFor={field.name} className="text-xs font-medium text-gray-700">
                  Date
                </label>
                <TransactionDatePicker
                  date={field.state.value ? new Date(field.state.value) : new Date()}
                  setDate={date => field.handleChange(date ? date.toISOString().split('T')[0] : '')}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="movement_type"
            validators={{
              onChange: ({ value }) => (!value ? 'Type is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Transaction Type</label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={value => field.handleChange(value as T_TransactionType)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="edit-expense" />
                    <Label htmlFor="edit-expense" className="text-xs">
                      Expense
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="edit-income" />
                    <Label htmlFor="edit-income" className="text-xs">
                      Income
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investment" id="edit-investment" />
                    <Label htmlFor="edit-investment" className="text-xs">
                      Investment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="edit-transfer" />
                    <Label htmlFor="edit-transfer" className="text-xs">
                      Transfer
                    </Label>
                  </div>
                </RadioGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="category_id">
            {field => (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Category</label>
                <HierarchicalCategorySelector
                  value={field.state.value || ''}
                  onValueChange={field.handleChange}
                  placeholder="Select category..."
                  size="sm"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Payment Method</label>
            <div className="flex items-center space-x-2 p-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600">
              <span className="font-medium">{getPaymentMethodLabel()}:</span>
              <span>{getAccountDisplayName()}</span>
              <span className="text-xs text-gray-500">(locked)</span>
            </div>
          </div>

          {/* Payment Status */}
          <form.Field name="is_paid">
            {field => (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Payment Status</label>
                <div className="flex items-center space-x-2">
                  <Switch checked={field.state.value} onCheckedChange={field.handleChange} />
                  <label className="text-xs text-muted-foreground">
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
