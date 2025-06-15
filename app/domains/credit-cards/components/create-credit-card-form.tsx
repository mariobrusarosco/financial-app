import { useForm } from '@tanstack/react-form';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { useCreateCreditCard } from '@/domains/credit-cards/hooks/use-create-credit-card';
import { CREDIT_CARD_BRANDS, DUE_DATE_OPTIONS } from '@/domains/credit-cards/types/constants';
import type { I_CreateCreditCardRequest } from '@/domains/credit-cards/types/types-and-interfaces';

interface Props {
  accountId: string;
}

export const CreateCreditCardForm = ({ accountId }: Props) => {
  const { createCreditCard, isLoading, error } = useCreateCreditCard();

  const form = useForm({
    defaultValues: {
      account_id: accountId,
      name: '',
      last_four_digits: '',
      brand: 'visa',
      credit_limit: 0,
      due_date: 1,
    } as I_CreateCreditCardRequest,
    onSubmit: async ({ value }) => {
      createCreditCard(value);
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Credit Card</CardTitle>
        <CardDescription>
          Add a new credit card to your account for tracking expenses and statements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Card Name */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'Card name is required'
                  : value.length < 2
                    ? 'Card name must be at least 2 characters'
                    : undefined,
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name}>Card Name</label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="e.g., Main Credit Card, Business Card"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Card Brand */}
          <form.Field name="brand">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name}>Card Brand</label>
                <Select
                  value={field.state.value}
                  onValueChange={value => field.handleChange(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select card brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_CARD_BRANDS.map(brand => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Last Four Digits */}
          <form.Field
            name="last_four_digits"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Last four digits are required';
                if (!/^\d{4}$/.test(value)) return 'Must be exactly 4 digits';
                return undefined;
              },
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name}>Last Four Digits</label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="1234"
                  maxLength={4}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Credit Limit */}
          <form.Field
            name="credit_limit"
            validators={{
              onChange: ({ value }) =>
                value <= 0 ? 'Credit limit must be greater than 0' : undefined,
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name}>Credit Limit</label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(Number(e.target.value))}
                  placeholder="5000.00"
                  min="0"
                  step="0.01"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Due Date */}
          <form.Field name="due_date">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name}>Due Date (Day of Month)</label>
                <Select
                  value={field.state.value.toString()}
                  onValueChange={value => field.handleChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select due date" />
                  </SelectTrigger>
                  <SelectContent>
                    {DUE_DATE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Credit Card'}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
