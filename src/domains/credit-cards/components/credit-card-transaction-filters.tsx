import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
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
import type { I_CreditCardTransactionsParams } from '@/domains/credit-cards/types/types-and-interfaces';

interface CreditCardTransactionFiltersProps {
  params: I_CreditCardTransactionsParams;
  onParamsChange: (params: I_CreditCardTransactionsParams) => void;
}

export const CreditCardTransactionFilters = ({
  params,
  onParamsChange,
}: CreditCardTransactionFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateParam = (key: keyof I_CreditCardTransactionsParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value || undefined,
      page: 1, // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onParamsChange({
      page: 1,
      per_page: params.per_page,
    });
  };

  const hasActiveFilters = Object.keys(params).some(
    key =>
      key !== 'page' && key !== 'per_page' && params[key as keyof I_CreditCardTransactionsParams]
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {
                  Object.keys(params).filter(
                    key =>
                      key !== 'page' &&
                      key !== 'per_page' &&
                      params[key as keyof I_CreditCardTransactionsParams]
                  ).length
                }
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="From date"
                value={params.date_from || ''}
                onChange={e => updateParam('date_from', e.target.value)}
              />
              <Input
                type="date"
                placeholder="To date"
                value={params.date_to || ''}
                onChange={e => updateParam('date_to', e.target.value)}
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Amount Range</Label>
            <div className="space-y-2">
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

          {/* Text Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="space-y-2">
              <Input
                placeholder="Description contains..."
                value={params.description_contains || ''}
                onChange={e => updateParam('description_contains', e.target.value)}
              />
              <Input
                placeholder="Category"
                value={params.category || ''}
                onChange={e => updateParam('category', e.target.value)}
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              <Select
                value={params.is_paid?.toString() || ''}
                onValueChange={value =>
                  updateParam('is_paid', value === '' ? undefined : value === 'true')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                  <SelectItem value="false">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={params.movement_type || ''}
                onValueChange={value =>
                  updateParam('movement_type', value === '' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sorting</Label>
            <div className="space-y-2">
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
      </CollapsibleContent>
    </Collapsible>
  );
};
