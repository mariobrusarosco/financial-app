import type { I_Subscription } from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, DollarSign } from 'lucide-react'; // Removed Repeat
import { format, parseISO } from 'date-fns'; // Added parseISO
import { cn } from '@/domains/ui-system/utils';

interface SubscriptionItemProps {
  subscription: I_Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionItem = ({ subscription, onEdit, onDelete }: SubscriptionItemProps) => {
  return (
    <li
      data-ui="subscription-item"
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{subscription.name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {subscription.amount} {subscription.currency} | Frequency: {subscription.billing_cycle}
          </p>
          <p className="text-sm text-muted-foreground">
            Next Payment: {format(parseISO(subscription.next_due_date), 'PP')}
          </p>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
              subscription.is_active
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500',
            )}
          >
            {subscription.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(subscription.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(subscription.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
};
