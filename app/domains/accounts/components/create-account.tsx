import { useForm } from '@tanstack/react-form';
import type { I_Account, I_CreateAccountForm, T_AccountType } from '../typing/types-and-interfaces';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useCreateAccount } from '@/domains/accounts/hooks/use-create-account';
import { Link } from '@tanstack/react-router';

const CreateAccount = () => {
  const { data: brokers, isFetching } = useBrokers();
  const { mutate: createAccount } = useCreateAccount();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      broker_id: '',
      type: 'checking',
      balance: 0,
      currency: 'USD',
    } as I_CreateAccountForm,
    onSubmit: ({ value }) => {
      createAccount(value as I_Account);
    },
  });

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h1>
        <Link to="/accounts" className="text-gray-500 hover:text-gray-700">
          <p className="text-sm">Back</p>
        </Link>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => (!value ? 'Account name is required' : undefined),
          }}
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Account Name:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter account name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="description"
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        />

        <form.Field
          name="broker_id"
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Broker:
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {brokers?.map(broker => (
                  <option key={broker.id} value={broker.id}>
                    {broker.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <form.Field
          name="type"
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Account Type:
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value as T_AccountType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
                <option value="investment">Investment</option>
              </select>
            </div>
          )}
        />

        <form.Field
          name="balance"
          validators={{
            onChange: ({ value }) => (value < 0 ? 'Balance cannot be negative' : undefined),
          }}
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Initial Balance:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Field
          name="currency"
          validators={{
            onChange: ({ value }) => (!value ? 'Currency is required' : undefined),
          }}
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Currency:
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
              </select>
              {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          )}
        />
      </form>
    </div>
  );
};

export default CreateAccount;
