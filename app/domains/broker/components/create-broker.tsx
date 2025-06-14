import { useForm } from '@tanstack/react-form';
import type { I_Create_BrokerForm } from '@/domains/broker/type/types-and-interfaces';
import useCreateBroker from '@/domains/broker/hooks/use-create-broker';

const CreateBroker = () => {
  const mutation = useCreateBroker();
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      colors: ['#000000', '#000000'],
      logo: '',
    } as I_Create_BrokerForm,
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Broker</h1>

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
            onChange: ({ value }) => (!value ? 'Broker name is required' : undefined),
          }}
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Broker Name:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter broker name"
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
          name="logo"
          children={field => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Broker logo:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter broker logo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        />

        <form.Field
          name="colors"
          validators={{
            onChange: ({ value }) => (value.length !== 2 ? 'Two colors are required' : undefined),
          }}
          children={field => (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="color1" className="block text-sm font-medium text-gray-700">
                  Primary Color:
                </label>
                <input
                  id="color1"
                  name="color1"
                  value={field.state.value[0]}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    const newColors = [...field.state.value];
                    newColors[0] = e.target.value;
                    field.handleChange(newColors);
                  }}
                  type="color"
                  className="w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="color2" className="block text-sm font-medium text-gray-700">
                  Secondary Color:
                </label>
                <input
                  id="color2"
                  name="color2"
                  value={field.state.value[1]}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    const newColors = [...field.state.value];
                    newColors[1] = e.target.value;
                    field.handleChange(newColors);
                  }}
                  type="color"
                  className="w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
              )}
            </div>
          )}
        />

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting, mutation.isPending]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || mutation.isPending ? 'Creating...' : 'Create Broker'}
            </button>
          )}
        />
      </form>
    </div>
  );
};

export default CreateBroker;
