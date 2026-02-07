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
import { RadioGroup, RadioGroupItem } from '@/domains/ui-system/components/radio-group';
import { Label } from '@/domains/ui-system/components/label';
import { useInvestments, useCreateInvestmentMovement } from '../hooks/use-investments';
import type { I_CreateInvestmentMovementRequest } from '../types/types-and-interfaces';

interface CreateInvestmentMovementProps {
  onAddMovement?: (movement: I_CreateInvestmentMovementRequest) => void;
}

const CreateInvestmentMovement = ({ onAddMovement }: CreateInvestmentMovementProps) => {
  const { data: investments } = useInvestments();
  const mutation = useCreateInvestmentMovement();

  const form = useForm({
    defaultValues: {
      investment_id: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      movement_type: 'deposit' as 'deposit' | 'withdrawal',
      description: '',
    } as I_CreateInvestmentMovementRequest,
    onSubmit: ({ value }) => {
      if (onAddMovement) {
        onAddMovement(value);
        form.reset();
      } else {
        mutation.mutate(value);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <form
          id="investment-movement-create-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Selection */}
            <form.Field
              name="investment_id"
              validators={{
                onChange: ({ value }) => (!value ? 'Please select an investment' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Investment:
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an investment" />
                    </SelectTrigger>
                    <SelectContent>
                      {investments?.data.map(investment => (
                        <SelectItem key={investment.investment.id} value={investment.investment.id}>
                          {investment.investment.name}
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

            {/* Date */}
            <form.Field
              name="date"
              validators={{
                onChange: ({ value }) => (!value ? 'Date is required' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Date:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    type="date"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movement Type */}
            <form.Field name="movement_type">
              {field => (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-primary">Movement Type:</label>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as 'deposit' | 'withdrawal')}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deposit" id="deposit" />
                      <Label htmlFor="deposit" className="text-sm font-medium cursor-pointer">
                        Deposit
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="withdrawal" id="withdrawal" />
                      <Label htmlFor="withdrawal" className="text-sm font-medium cursor-pointer">
                        Withdrawal
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </form.Field>

            {/* Amount */}
            <form.Field
              name="amount"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value <= 0) return 'Amount must be greater than 0';
                  return undefined;
                },
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-primary">
                    Amount:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
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
                  placeholder="Optional description for this movement"
                  rows={2}
                />
              </div>
            )}
          </form.Field>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentMovement;
