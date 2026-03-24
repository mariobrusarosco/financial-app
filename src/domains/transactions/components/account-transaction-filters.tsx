import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/domains/ui-system/components/button';
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
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { HierarchicalCategorySelector } from './hierarchical-category-selector';

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
    (key: keyof I_AccountTransactionsParams, value: any) => {
      // Add defensive checks to prevent rapid updates
      const currentValue = params[key];
      if (currentValue === value) return;

      onParamsChange({
        ...params,
        [key]: value || undefined,
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
      sort_order: 'desc',
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
            {hasActiveFilters && (
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
            )}
            <ChevronDown className="h-4 w-4" />
          </div>
        </CollapsibleTrigger>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      <CollapsibleContent className="space-y-4 mt-4">
        <div className="flex flex-col gap-4 p-4 bg-background rounded-lg border border-primary/20">
          <div className="flex gap-4">
            <div data-ui="search-filter" className="space-y-2 ">
              <Label className="text-sm font-medium">Search</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Description contains..."
                  value={params.description_contains || ''}
                  onChange={e => updateParam('description_contains', e.target.value)}
                />
              </div>
            </div>

            <div data-ui="category-filter" className="space-y-2 items-center gap-4 max-w-[200px]">
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex items-center gap-2">
                <HierarchicalCategorySelector
                  value={params.category || ''}
                  onValueChange={value => updateParam('category', value)}
                  placeholder="Filter by Category"
                  className="w-full bg-background"
                  size="sm"
                />
                {params.category && (
                  <span
                    className="text-xs text-primary cursor-pointer"
                    onClick={() => updateParam('category', undefined)}
                  >
                    clear
                  </span>
                )}
              </div>
            </div>

            <div data-ui="type-filter" className="space-y-2 lg:col-span-3">
              <Label className="text-sm font-medium">Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-income"
                    checked={params.movement_type === 'income'}
                    onCheckedChange={checked =>
                      updateParam('movement_type', checked ? 'income' : undefined)
                    }
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
                    checked={params.movement_type === 'expense'}
                    onCheckedChange={checked =>
                      updateParam('movement_type', checked ? 'expense' : undefined)
                    }
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
          </div>

          <div className="flex gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={params.amount_min || ''}
                  onChange={e => updateParam('amount_min', parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={params.amount_max || ''}
                  onChange={e => updateParam('amount_max', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex gap-2 space-y-2">
                <Select
                  value={params.is_paid?.toString() || 'all'}
                  onValueChange={value =>
                    updateParam('is_paid', value === 'all' ? undefined : value === 'true')
                  }
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
                  value={params.movement_type || 'all'}
                  onValueChange={value =>
                    updateParam('movement_type', value === 'all' ? undefined : value)
                  }
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

            <div className="space-y-2">
              <Label className="text-xs font-medium">Sorting</Label>
              <div className="flex gap-2">
                <Select
                  value={params.sort_by || 'date'}
                  onValueChange={value => updateParam('sort_by', value)}
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
                  value={params.sort_order || 'desc'}
                  onValueChange={value => updateParam('sort_order', value)}
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

            {/* Per Page */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Items per page</Label>
              <Select
                value={params.per_page?.toString() || '20'}
                onValueChange={value => updateParam('per_page', parseInt(value))}
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
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
