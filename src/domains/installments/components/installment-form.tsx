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
import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import type { I_CreateInstallmentPlanRequest } from '../types/types-and-interfaces';
import type { UseForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { Calculator } from '@/domains/ui-system/components/calculator';

interface InstallmentFormProps {
  form: UseForm<I_CreateInstallmentPlanRequest>;
}

export const InstallmentForm = ({ form }: InstallmentFormProps) => {
  // Fetch all vendors for selector (max allowed by API)
  const { data: vendorsData } = useVendors({ per_page: 100 });
  const { data: creditCardsData } = useQuery({
    queryKey: ['credit_cards', 'all'],
    queryFn: () => creditCardApi.getAllCreditCards(),
  });
  const [showCalculator, setShowCalculator] = useState(false);
  const [installmentValue, setInstallmentValue] = useState('');

  // The total is derived from installment value × count; it's the only amount the API receives
  const syncTotalAmount = (value: number, count: number) => {
    const total =
      Number.isFinite(value) && value > 0 && Number.isInteger(count) && count > 0
        ? Math.round(value * count * 100) / 100
        : 0;
    form.setFieldValue('total_amount', total);
  };

  const updateInstallmentValue = (value: string) => {
    setInstallmentValue(value);
    syncTotalAmount(parseFloat(value), form.getFieldValue('installment_count'));
  };

  const availableVendors = vendorsData?.data || [];
  const availableCreditCards = creditCardsData?.data || [];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 relative">
          <Label htmlFor="installment_value">Installment Value</Label>
          <Input
            id="installment_value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={installmentValue}
            onChange={e => updateInstallmentValue(e.target.value)}
          />
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-xs text-muted-foreground"
            onClick={() => setShowCalculator(!showCalculator)}
            type="button"
          >
            <CalculatorIcon className="w-3 h-3 mr-1" />
            {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </Button>
          {showCalculator && (
            <div className="absolute z-50 mt-1 shadow-lg">
              <Calculator
                initialValue={parseFloat(installmentValue) || undefined}
                onApply={val => updateInstallmentValue(val.toString())}
                onClose={() => setShowCalculator(false)}
              />
            </div>
          )}
        </div>

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
                onChange={e => {
                  const count = parseInt(e.target.value);
                  field.handleChange(count);
                  syncTotalAmount(parseFloat(installmentValue), count);
                }}
              />
              {field.state.meta.touched && field.state.meta.errors.length > 0 && (
                <em className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="total_amount"
          children={field => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Total Amount</Label>
              <Input
                id={field.name}
                type="number"
                readOnly
                tabIndex={-1}
                placeholder="0.00"
                value={field.state.value > 0 ? field.state.value.toFixed(2) : ''}
                className="cursor-default bg-muted/60 text-muted-foreground focus-visible:ring-0"
              />
              <p className="text-xs text-muted-foreground">Installment value × installments</p>
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
