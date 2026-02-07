import { useForm } from '@tanstack/react-form';
import { Input } from '@/domains/ui-system/components/input';
import { Textarea } from '@/domains/ui-system/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useCreateInvestment } from '../hooks/use-investments';
import type { I_CreateInvestmentRequest } from '../types/types-and-interfaces';

const CreateInvestment = () => {
  const { data: brokers } = useBrokers();
  const mutation = useCreateInvestment();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      broker_id: '',
    } as I_CreateInvestmentRequest,
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <form
          id="investment-create-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Name */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Investment name is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Investment Name:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="e.g., NU INVEST, XP Investimentos"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Broker Selection */}
            <form.Field
              name="broker_id"
              validators={{
                onChange: ({ value }) => (!value ? 'Please select a broker' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
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
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Description */}
          <form.Field name="description">
            {field => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-primary">
                  Description:
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Optional description for this investment account"
                  rows={3}
                />
              </div>
            )}
          </form.Field>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestment;
