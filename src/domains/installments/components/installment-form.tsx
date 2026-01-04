import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { useVendors } from '@/domains/vendors/hooks';
import { VendorSelector } from '@/domains/vendors/components/vendor-selector';
import { TransactionDatePicker } from '@/domains/transactions/components/transaction-date-picker';
import * as dateFns from 'date-fns';
import { useCategories } from '@/domains/categories/hooks/use-categories';
import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import type { I_CreateInstallmentPlanRequest } from '../types/types-and-interfaces';
import type { UseForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { Calculator } from 'lucide-react';
import { CompactCalculator } from './compact-calculator';

interface InstallmentFormProps {
  form: UseForm<I_CreateInstallmentPlanRequest>;
}

export const InstallmentForm = ({ form }: InstallmentFormProps) => {
  const { data: vendorsData } = useVendors();
  const { data: categoriesData } = useCategories();
  const { data: creditCardsData } = useQuery({
    queryKey: ['credit_cards', 'all'],
    queryFn: () => creditCardApi.getAllCreditCards(),
  });
  const [showCalculator, setShowCalculator] = useState(false);

  const availableVendors = vendorsData?.data || [];
  const availableCreditCards = creditCardsData?.data || [];

  const availableCategories: { id: string; name: string; level: number }[] = [];
  (categoriesData || []).forEach(cat => {
    availableCategories.push({ id: cat.id, name: cat.name, level: 0 });
    if (cat.children) {
      cat.children.forEach(child => {
        availableCategories.push({ id: child.id, name: child.name, level: 1 });
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="name"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Plan Name</Label>
              <Input
                id={field.name}
                placeholder="e.g. New MacBook Pro"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.touched && field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="start_date"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Start Date (First Installment)</Label>
              <TransactionDatePicker
                date={field.state.value ? dateFns.parseISO(field.state.value) : undefined}
                setDate={date => field.handleChange(date ? dateFns.format(date, 'yyyy-MM-dd') : '')}
              />
              {field.state.meta.touched && field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="total_amount"
          children={field => (
            <div className="space-y-2 relative">
              <Label htmlFor={field.name}>Total Amount</Label>
              <Input
                id={field.name}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(parseFloat(e.target.value))}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-muted-foreground"
                  onClick={() => setShowCalculator(!showCalculator)}
                  type="button"
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
                </Button>
              </div>
              {showCalculator && (
                <div className="absolute z-50 mt-1 shadow-lg">
                  <CompactCalculator
                    initialValue={field.state.value}
                    onApply={(val) => field.handleChange(val)}
                    onClose={() => setShowCalculator(false)}
                  />
                </div>
              )}
              {field.state.meta.touched && field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="installment_count"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Number of Installments</Label>
              <Input
                id={field.name}
                type="number"
                min="1"
                max="120"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(parseInt(e.target.value))}
              />
              {field.state.meta.touched && field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field
          name="credit_card_id"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Credit Card</Label>
              <Select value={field.state.value || ''} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Card (Cash/Debit)</SelectItem>
                  {availableCreditCards.map(card => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name} (****{card.last_four_digits})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <form.Field
          name="vendor_id"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Vendor</Label>
              <VendorSelector
                value={field.state.value || ''}
                onValueChange={field.handleChange}
                vendors={availableVendors}
              />
            </div>
          )}
        />

        <form.Field
          name="category_id"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Category</Label>
              <Select value={field.state.value || ''} onValueChange={field.handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.level > 0 ? `\u00A0\u00A0 ${category.name}` : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <form.Field
        name="description"
        children={field => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Notes (Optional)</Label>
            <Input
              id={field.name}
              placeholder="Add extra details..."
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />
    </div>
  );
};