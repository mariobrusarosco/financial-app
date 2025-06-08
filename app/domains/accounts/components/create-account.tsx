import { useForm } from '@tanstack/react-form';
import type { I_CreateAccountForm, T_AccountType } from '../typing/types-and-interfaces';

const CreateAccount = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: 'checking',
      balance: 0,
      currency: 'USD',
    } as I_CreateAccountForm,
    onSubmit: ({ value }) => {
      // Handle form submission
      console.log('Form submitted:', value);
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h1>

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
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
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
