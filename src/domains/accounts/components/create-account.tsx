import { useForm } from '@tanstack/react-form';
import type {
  I_CreateAccountForm,
  T_AccountCurrency,
  T_AccountType,
} from '../types/types-and-interfaces';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useCreateAccount } from '@/domains/accounts/hooks/use-create-account';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';

const CreateAccount = () => {
  const { data: brokers, isFetching } = useBrokers();
  const { mutate: createAccount } = useCreateAccount();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      broker_id: '',
      type: 'savings',
      balance: 0,
      currency: 'BRL',
    } as I_CreateAccountForm,
    onSubmit: ({ value }) => {
      void createAccount(value);
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
      <div className="space-y-6">
        <form
          id="account-create-form"
          data-testid="account-create-form"
          onSubmit={e => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Three Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Basic Info */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Account name is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Account Name:
                  </label>
                  <Input
                    data-testid="account-name-input"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="Enter account name"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Column 2: Account Details */}
            <form.Field name="type">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Account Type:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as T_AccountType)}
                  >
                    <SelectTrigger data-testid="account-type-select">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            {/* Column 3: Financial Details */}
            <form.Field
              name="balance"
              validators={{
                onChange: ({ value }) => (value < 0 ? 'Balance cannot be negative' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Initial Balance:
                  </label>
                  <Input
                    data-testid="account-balance-input"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
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
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Description */}
            <form.Field name="description">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Description:
                  </label>
                  <Input
                    data-testid="account-description-input"
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="Enter description (optional)"
                  />
                </div>
              )}
            </form.Field>

            {/* Column 2: Broker */}
            <form.Field name="broker_id">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Broker:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value)}
                  >
                    <SelectTrigger data-testid="account-broker-select">
                      <SelectValue placeholder="Select a broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers?.map(broker => (
                        <SelectItem key={broker.id} value={broker.id}>
                          {broker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            {/* Column 3: Currency */}
            <form.Field
              name="currency"
              validators={{
                onChange: ({ value }) => (!value ? 'Currency is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Currency:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as T_AccountCurrency)}
                  >
                    <SelectTrigger data-testid="account-currency-select">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
