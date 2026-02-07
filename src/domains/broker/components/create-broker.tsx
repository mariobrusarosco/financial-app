import { useForm } from '@tanstack/react-form';
import type { I_Create_BrokerForm } from '@/domains/broker/type/types-and-interfaces';
import useCreateBroker from '@/domains/broker/hooks/use-create-broker';
import { Input } from '@/domains/ui-system/components/input';

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
      void mutation.mutate(value);
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <form
          id="broker-create-form"
          onSubmit={e => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Basic Info */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Broker name is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Broker Name:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="Enter broker name"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Column 2: Logo */}
            <form.Field name="logo">
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Broker Logo URL:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="Enter broker logo URL"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Description:
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="Enter description (optional)"
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="colors"
              validators={{
                onChange: ({ value }) =>
                  value.length !== 2 ? 'Two colors are required' : undefined,
              }}
            >
              {field => (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="color1" className="text-sm font-medium text-primary">
                      Primary Color:
                    </label>
                    <Input
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
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="color2" className="text-sm font-medium text-primary">
                      Secondary Color:
                    </label>
                    <Input
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
                      className="h-12"
                    />
                  </div>

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

export default CreateBroker;
