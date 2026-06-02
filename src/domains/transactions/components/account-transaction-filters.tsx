import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { Checkbox } from '@/domains/ui-system/components/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/domains/ui-system/components/collapsible';
import { ChevronDown, Filter, X } from 'lucide-react';
import { useDebouncedControlledValue } from '@/domains/global/hooks/use-debounced-controlled-value';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { HierarchicalCategorySelector } from '@/domains/transactions/components/hierarchical-category-selector';

interface AccountTransactionFiltersProps {
  params: I_AccountTransactionsParams;
  onParamsChange: (params: I_AccountTransactionsParams) => void;
}

export const AccountTransactionFilters = ({
  params,
  onParamsChange,
}: AccountTransactionFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateParam = useCallback(
    <K extends keyof I_AccountTransactionsParams>(
      key: K,
      value: I_AccountTransactionsParams[K]
    ) => {
      // Add defensive checks to prevent rapid updates
      const currentValue = params[key];
      if (currentValue === value) return;

      const nextValue = value || undefined;

      onParamsChange({
        ...params,
        [key]: nextValue,
        page: 1, // Reset to first page when filters change
      });
    },
    [params, onParamsChange]
  );

  const clearFilters = useCallback(() => {
    onParamsChange({
      page: 1,
      per_page: params.per_page,
      sort_by: 'date',
      sort_order: 'asc',
    });
  }, [onParamsChange, params.per_page]);

  const hasActiveFilters = useMemo(() => Object.keys(params).length, [params]);

  console.log('hasActiveFilters', hasActiveFilters, params);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="py-4">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-xs"> Filters</span>
            {/* {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {console.log(
                  Object.keys(params).filter(
                    key =>
                      key !== 'page' &&
                      key !== 'per_page' &&
                      params[key as keyof I_AccountTransactionsParams]
                  )
                )}
              </span>
            )} */}
            <ChevronDown className="h-4 w-4" />

            {hasActiveFilters && <ClearFiltersButton onClick={clearFilters} />}
          </div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4 mt-4">
        <div className="flex flex-col gap-4 p-4 bg-background rounded-lg border border-primary/20">
          <div className="flex gap-4">
            <SearchFilter
              value={params.description_contains || ''}
              onChange={value => updateParam('description_contains', value)}
            />

            <CategoryFilter
              value={params.category || ''}
              onChange={value => updateParam('category', value)}
            />

            <TypeFilter
              value={params.movement_type}
              onChange={value => updateParam('movement_type', value)}
            />
          </div>

          <div className="flex gap-4">
            <AmountRangeFilter
              minAmount={params.amount_min}
              maxAmount={params.amount_max}
              onMinAmountChange={value => updateParam('amount_min', value)}
              onMaxAmountChange={value => updateParam('amount_max', value)}
            />

            <StatusFilter
              isPaid={params.is_paid}
              movementType={params.movement_type}
              onIsPaidChange={value => updateParam('is_paid', value)}
              onMovementTypeChange={value => updateParam('movement_type', value)}
            />

            <SortingFilter
              sortBy={params.sort_by}
              sortOrder={params.sort_order}
              onSortByChange={value => updateParam('sort_by', value)}
              onSortOrderChange={value => updateParam('sort_order', value)}
            />

            <ItemsPerPageFilter
              value={params.per_page}
              onChange={value => updateParam('per_page', value)}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SearchFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { draftValue: searchDraft, setDraftValue: setSearchDraft } = useDebouncedControlledValue({
    value,
    onChange,
  });

  return (
    <div data-ui="search-filter" className="flex flex-col gap-1 justify-between">
      <Label className="text-sm font-medium">Search</Label>
      <div className="space-y-2">
        <Input
          placeholder="Description contains..."
          value={searchDraft}
          onChange={e => setSearchDraft(e.target.value)}
        />
      </div>
    </div>
  );
};

const CategoryFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div data-ui="category-filter" className="flex flex-col gap-2 justify-between max-w-[200px]">
      <Label className="text-sm font-medium">Category</Label>
      <div className="flex items-center gap-2">
        <HierarchicalCategorySelector
          value={value}
          onValueChange={onChange}
          placeholder="Filter by Category"
          className="w-full bg-background"
          size="sm"
        />
        {value && (
          <span className="text-xs text-primary cursor-pointer" onClick={() => onChange('')}>
            clear
          </span>
        )}
      </div>
    </div>
  );
};

const TypeFilter = ({
  value,
  onChange,
}: {
  value: I_AccountTransactionsParams['movement_type'];
  onChange: (value: I_AccountTransactionsParams['movement_type']) => void;
}) => {
  return (
    <div data-ui="type-filter" className="flex flex-col gap-1 justify-between">
      <Label className="text-sm font-medium">Type</Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-income"
            checked={value === 'income'}
            onCheckedChange={checked => onChange(checked ? 'income' : undefined)}
          />
          <label
            htmlFor="filter-income"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Income
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-expense"
            checked={value === 'expense'}
            onCheckedChange={checked => onChange(checked ? 'expense' : undefined)}
          />
          <label
            htmlFor="filter-expense"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Expense
          </label>
        </div>
      </div>
    </div>
  );
};

const AmountRangeFilter = ({
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
}: {
  minAmount: I_AccountTransactionsParams['amount_min'];
  maxAmount: I_AccountTransactionsParams['amount_max'];
  onMinAmountChange: (value: I_AccountTransactionsParams['amount_min']) => void;
  onMaxAmountChange: (value: I_AccountTransactionsParams['amount_max']) => void;
}) => {
  const { draftValue: minAmountDraft, setDraftValue: setMinAmountDraft } =
    useDebouncedControlledValue<string, I_AccountTransactionsParams['amount_min']>({
      value: minAmount,
      onChange: onMinAmountChange,
      format: value => value?.toString() ?? '',
      parse: value => {
        const parsedValue = parseFloat(value);

        return value === '' || Number.isNaN(parsedValue) ? undefined : parsedValue;
      },
    });
  const { draftValue: maxAmountDraft, setDraftValue: setMaxAmountDraft } =
    useDebouncedControlledValue<string, I_AccountTransactionsParams['amount_max']>({
      value: maxAmount,
      onChange: onMaxAmountChange,
      format: value => value?.toString() ?? '',
      parse: value => {
        const parsedValue = parseFloat(value);

        return value === '' || Number.isNaN(parsedValue) ? undefined : parsedValue;
      },
    });

  return (
    <div className="flex flex-col gap-1 justify-between">
      <Label className="text-sm font-medium">Amount Range</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min amount"
          value={minAmountDraft}
          onChange={e => setMinAmountDraft(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max amount"
          value={maxAmountDraft}
          onChange={e => setMaxAmountDraft(e.target.value)}
        />
      </div>
    </div>
  );
};

const StatusFilter = ({
  isPaid,
  movementType,
  onIsPaidChange,
  onMovementTypeChange,
}: {
  isPaid: I_AccountTransactionsParams['is_paid'];
  movementType: I_AccountTransactionsParams['movement_type'];
  onIsPaidChange: (value: I_AccountTransactionsParams['is_paid']) => void;
  onMovementTypeChange: (value: I_AccountTransactionsParams['movement_type']) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 justify-between">
      <Label className="text-sm font-medium">Status</Label>
      <div className="flex gap-2">
        <Select
          value={isPaid?.toString() || 'all'}
          onValueChange={value => onIsPaidChange(value === 'all' ? undefined : value === 'true')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Paid</SelectItem>
            <SelectItem value="false">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={movementType || 'all'}
          onValueChange={value => onMovementTypeChange(value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Movement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const SortingFilter = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: {
  sortBy: I_AccountTransactionsParams['sort_by'];
  sortOrder: I_AccountTransactionsParams['sort_order'];
  onSortByChange: (value: I_AccountTransactionsParams['sort_by']) => void;
  onSortOrderChange: (value: I_AccountTransactionsParams['sort_order']) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 justify-between">
      <Label className="text-xs font-medium">Sorting</Label>
      <div className="flex gap-2">
        <Select
          value={sortBy || 'date'}
          onValueChange={value => onSortByChange(value as I_AccountTransactionsParams['sort_by'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="created_at">Created</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder || 'desc'}
          onValueChange={value =>
            onSortOrderChange(value as I_AccountTransactionsParams['sort_order'])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const ItemsPerPageFilter = ({
  value,
  onChange,
}: {
  value: I_AccountTransactionsParams['per_page'];
  onChange: (value: I_AccountTransactionsParams['per_page']) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 justify-between">
      <Label className="text-xs font-medium">Items per page</Label>
      <Select
        value={value?.toString() || '20'}
        onValueChange={nextValue => onChange(parseInt(nextValue))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const ClearFiltersButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="flex items-center gap-1 cursor-pointer text-primary-foreground bg-primary hover:bg-primary/80 p-2 rounded-md"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
      <span className="text-xs">Clear</span>
    </button>
  );
};
