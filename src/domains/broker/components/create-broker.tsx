import { useForm } from '@tanstack/react-form';
import type { I_Create_BrokerForm } from '@/domains/broker/type/types-and-interfaces';
import useCreateBroker from '@/domains/broker/hooks/use-create-broker';
import { Card } from '@/domains/ui-system/components/card';
import { Input } from '@/domains/ui-system/components/input';
import { Button } from '@/domains/ui-system/components/button';

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
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Broker</h1>

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
              onChange: ({ value }) => (!value ? 'Broker name is required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium">
                  Broker Name
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
                  <p className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium">
                  Description
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

          <form.Field name="logo">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium">
                  Broker Logo
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

          <form.Field
            name="colors"
            validators={{
              onChange: ({ value }) => (value.length !== 2 ? 'Two colors are required' : undefined),
            }}
          >
            {field => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="color1" className="block text-sm font-medium">
                    Primary Color
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
                  <label htmlFor="color2" className="block text-sm font-medium">
                    Secondary Color
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
                  <p className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting, mutation.isPending]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className="w-full">
                {isSubmitting || mutation.isPending ? 'Creating...' : 'Create Broker'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Card>
    </div>
  );
};

export default CreateBroker;
