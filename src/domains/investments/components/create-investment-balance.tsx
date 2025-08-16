import { useForm } from '@tanstack/react-form';
import { Input } from '@/domains/ui-system/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/domains/ui-system/components/select';
import { useInvestments, useCreateInvestmentBalance } from '../hooks/use-investments';
import type { I_CreateInvestmentBalanceRequest } from '../types/types-and-interfaces';

interface CreateInvestmentBalanceProps {
  onAddBalance?: (balance: I_CreateInvestmentBalanceRequest) => void;
}

const CreateInvestmentBalance = ({ onAddBalance }: CreateInvestmentBalanceProps) => {
  const { data: investments } = useInvestments();
  const mutation = useCreateInvestmentBalance();

  const form = useForm({
    defaultValues: {
      investment_id: '',
      date: new Date().toISOString().split('T')[0],
      balance: 0,
    } as I_CreateInvestmentBalanceRequest,
    onSubmit: ({ value }) => {
      if (onAddBalance) {
        onAddBalance(value);
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
          id="investment-balance-create-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Investment Selection */}
            <form.Field
              name="investment_id"
              validators={{
                onChange: ({ value }) => (!value ? 'Please select an investment' : undefined),
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
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
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
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

            {/* Balance */}
            <form.Field
              name="balance"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value <= 0) return 'Balance must be greater than 0';
                  return undefined;
                },
              }}
            >
              {field => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Balance Amount:
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

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Balance Entry Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Enter the total portfolio value on this date</li>
              <li>• This should include all stocks, bonds, and cash positions</li>
              <li>• Growth will be automatically calculated from previous entries</li>
              <li>• Make sure to record movements (deposits/withdrawals) separately</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentBalance;
