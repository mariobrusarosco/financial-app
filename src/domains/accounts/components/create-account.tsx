import { useForm } from '@tanstack/react-form';
import type {
  I_CreateAccountForm,
  T_AccountCurrency,
  T_AccountType,
} from '../types/types-and-interfaces';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useCreateAccount } from '@/domains/accounts/hooks/use-create-account';
import { Link } from '@tanstack/react-router';
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
import { ArrowLeft } from 'lucide-react';

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
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Link to="/accounts">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Add a new financial account to track your investments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              void form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Account name is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Account Name:
                  </label>
                  <Input
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

            <form.Field name="description">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Description:
                  </label>
                  <Input
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

            <form.Field name="broker_id">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Broker:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value)}
                  >
                    <SelectTrigger>
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

            <form.Field name="type">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Account Type:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as T_AccountType)}
                  >
                    <SelectTrigger>
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

            <form.Field
              name="balance"
              validators={{
                onChange: ({ value }) => (value < 0 ? 'Balance cannot be negative' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Initial Balance:
                  </label>
                  <Input
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

            <form.Field
              name="currency"
              validators={{
                onChange: ({ value }) => (!value ? 'Currency is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Currency:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as T_AccountCurrency)}
                  >
                    <SelectTrigger>
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

            <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccount;
