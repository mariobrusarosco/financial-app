import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { TagSelector } from '@/domains/tags/components/tag-selector';
import { TransactionDatePicker } from '@/domains/transactions/components/transaction-date-picker';
import { useBulkUpdateTransactions } from '@/domains/transactions/hooks/use-bulk-update-transactions';
import type {
  T_BulkTransactionChanges,
  T_TransactionType,
} from '@/domains/transactions/types/types-and-interfaces';

type T_BulkEditableField =
  | 'tag_ids'
  | 'amount'
  | 'date'
  | 'description'
  | 'movement_type'
  | 'is_paid'
  | 'ignored';

interface BulkTransactionActionsProps {
  transactionIds: string[];
  isDeleting: boolean;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

const FIELD_OPTIONS: { value: T_BulkEditableField; label: string }[] = [
  { value: 'tag_ids', label: 'Tags' },
  { value: 'amount', label: 'Amount' },
  { value: 'date', label: 'Date' },
  { value: 'description', label: 'Description' },
  { value: 'movement_type', label: 'Movement type' },
  { value: 'is_paid', label: 'Payment status' },
  { value: 'ignored', label: 'Ignored status' },
];

const MOVEMENT_TYPE_OPTIONS: { value: T_TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'investment', label: 'Investment' },
  { value: 'transfer', label: 'Transfer' },
];

export const BulkTransactionActions = ({
  transactionIds,
  isDeleting,
  onClearSelection,
  onDeleteSelected,
}: BulkTransactionActionsProps) => {
  const [field, setField] = useState<T_BulkEditableField>('tag_ids');
  const [value, setValue] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const { mutate: updateTransactions, isPending: isUpdating } = useBulkUpdateTransactions();

  const changes = useMemo(() => toBulkChanges(field, value, tagIds), [field, value, tagIds]);
  const isBusy = isUpdating || isDeleting;

  const handleFieldChange = (nextField: T_BulkEditableField) => {
    setField(nextField);
    setValue('');
    setTagIds([]);
  };

  const handleApply = () => {
    if (!changes) return;

    updateTransactions(
      { transaction_ids: transactionIds, changes },
      { onSuccess: onClearSelection }
    );
  };

  return (
    <div
      data-ui="bulk-transaction-actions"
      className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-brand/20 bg-card/95 p-3 shadow-xl backdrop-blur sm:p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
            {transactionIds.length} selected
          </span>
          <span className="hidden text-sm text-muted-foreground md:inline">
            Apply one value to every selected transaction
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          disabled={isBusy}
          aria-label="Clear transaction selection"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <Select
          value={field}
          onValueChange={value => handleFieldChange(value as T_BulkEditableField)}
        >
          <SelectTrigger className="w-full lg:w-44" aria-label="Property to update">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="min-w-0 flex-1">
          <BulkValueEditor
            field={field}
            value={value}
            tagIds={tagIds}
            onValueChange={setValue}
            onTagIdsChange={setTagIds}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleApply}
            disabled={!changes || isBusy}
            className="flex-1 lg:flex-none"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isUpdating ? 'Applying…' : `Apply to ${transactionIds.length}`}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onDeleteSelected}
            disabled={isBusy}
            className="text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${transactionIds.length} selected transactions`}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BulkValueEditorProps {
  field: T_BulkEditableField;
  value: string;
  tagIds: string[];
  onValueChange: (value: string) => void;
  onTagIdsChange: (tagIds: string[]) => void;
}

const BulkValueEditor = ({
  field,
  value,
  tagIds,
  onValueChange,
  onTagIdsChange,
}: BulkValueEditorProps) => {
  if (field === 'tag_ids') {
    return (
      <TagSelector
        value={tagIds}
        onValueChange={onTagIdsChange}
        placeholder="Choose tags"
        className="w-full"
      />
    );
  }

  if (field === 'amount') {
    return (
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={event => onValueChange(event.target.value)}
        placeholder="Set exact amount"
        aria-label="New amount"
      />
    );
  }

  if (field === 'date') {
    return (
      <TransactionDatePicker
        date={value ? new Date(`${value}T00:00:00`) : undefined}
        setDate={date => onValueChange(format(date, 'yyyy-MM-dd'))}
      />
    );
  }

  if (field === 'description') {
    return (
      <Input
        value={value}
        onChange={event => onValueChange(event.target.value)}
        placeholder="New description"
        aria-label="New description"
      />
    );
  }

  if (field === 'movement_type') {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full" aria-label="New movement type">
          <SelectValue placeholder="Choose movement type" />
        </SelectTrigger>
        <SelectContent>
          {MOVEMENT_TYPE_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (field === 'is_paid') {
    return (
      <BooleanValueSelect
        value={value}
        onValueChange={onValueChange}
        trueLabel="Paid"
        falseLabel="Unpaid"
        placeholder="Choose payment status"
      />
    );
  }

  return (
    <BooleanValueSelect
      value={value}
      onValueChange={onValueChange}
      trueLabel="Mark as ignored"
      falseLabel="Mark as not ignored"
      placeholder="Choose ignored status"
    />
  );
};

interface BooleanValueSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  trueLabel: string;
  falseLabel: string;
  placeholder: string;
}

const BooleanValueSelect = ({
  value,
  onValueChange,
  trueLabel,
  falseLabel,
  placeholder,
}: BooleanValueSelectProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="true">{trueLabel}</SelectItem>
      <SelectItem value="false">{falseLabel}</SelectItem>
    </SelectContent>
  </Select>
);

const toBulkChanges = (
  field: T_BulkEditableField,
  value: string,
  tagIds: string[]
): T_BulkTransactionChanges | null => {
  if (field === 'tag_ids') return { tag_ids: tagIds };
  if (!value.trim()) return null;

  if (field === 'amount') {
    const amount = Number(value);
    return Number.isFinite(amount) && amount !== 0 ? { amount } : null;
  }

  if (field === 'is_paid') return { is_paid: value === 'true' };
  if (field === 'ignored') return { ignored: value === 'true' };
  if (field === 'movement_type') return { movement_type: value as T_TransactionType };
  if (field === 'date') return { date: value };

  return { description: value.trim() };
};
