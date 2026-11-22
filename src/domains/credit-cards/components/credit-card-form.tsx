import { useForm } from '@tanstack/react-form';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { Switch } from '@/domains/ui-system/components/switch';
import { CREDIT_CARD_BRANDS } from '@/domains/credit-cards/types/constants';
import type { T_CreditCardBrand } from '@/domains/credit-cards/types/types-and-interfaces';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';

export interface CreditCardFormValues {
  account_id: string;
  name: string;
  last_four_digits: string;
  brand: T_CreditCardBrand;
  credit_limit: number;
  due_day: number;
  is_active: boolean;
}

interface CreditCardFormProps {
  formId: string;
  initialValues: CreditCardFormValues;
  onSubmit: (values: CreditCardFormValues) => void;
  /** Create only: a card can't move to another account once created */
  showAccountField?: boolean;
  /** Edit only: new cards always start active */
  showActiveField?: boolean;
  error?: Error | null;
}

export const CreditCardForm = ({
  formId,
  initialValues,
  onSubmit,
  showAccountField = false,
  showActiveField = false,
  error,
}: CreditCardFormProps) => {
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const accounts = accountsQuery.data?.accounts ?? [];

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <div className="max-w-6xl mx-auto">
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Card Name:
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="e.g., Main Credit Card, Business Card"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          {showAccountField && (
            <form.Field
              name="account_id"
              validators={{
                onChange: ({ value }) => (!value ? 'Please select an account' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Account:
                  </label>
                  {accountsQuery.isLoading ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      Loading accounts...
                    </div>
                  ) : (
                    <Select
                      value={field.state.value}
                      onValueChange={value => field.handleChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{account.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {account.type}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                  ) : null}
                </div>
              )}
            </form.Field>
          )}
        </div>

        <div className="flex gap-6">
          <form.Field name="brand">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Card Brand:
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={value => field.handleChange(value as T_CreditCardBrand)}
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
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Last Four Digits:
                </label>
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
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-6">
          <form.Field
            name="credit_limit"
            validators={{
              onChange: ({ value }) =>
                value <= 0 ? 'Credit limit must be greater than 0' : undefined,
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Credit Limit:
                </label>
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
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="due_day"
            validators={{
              onChange: ({ value }) =>
                !Number.isInteger(value) || value < 1 || value > 31
                  ? 'Due day must be between 1 and 31'
                  : undefined,
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Due Date (Day of Month):
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  // 0 means "not set" (a card created before due days were stored)
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(Number(e.target.value))}
                  placeholder="1-31"
                  min="1"
                  max="31"
                  step="1"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        {showActiveField && (
          <form.Field name="is_active">
            {field => (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/80 p-4">
                <div>
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Active
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Turn off for a card you no longer use. Its transactions and invoices are kept.
                  </p>
                </div>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={checked => field.handleChange(checked)}
                />
              </div>
            )}
          </form.Field>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        )}
      </form>
    </div>
  );
};
