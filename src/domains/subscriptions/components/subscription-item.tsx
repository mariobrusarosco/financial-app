import { useState } from 'react';
import type { I_Subscription } from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import { SubscriptionPaymentHistory } from './subscription-payment-history';

interface SubscriptionItemProps {
  subscription: I_Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionItem = ({ subscription, onEdit, onDelete }: SubscriptionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li
      data-ui="subscription-item"
      className="border rounded-lg transition-colors bg-card"
    >
      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-lg">
        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{subscription.name}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Amount: {subscription.amount} {subscription.currency} | Frequency: {subscription.billing_cycle}
            </p>
            <p className="text-sm text-muted-foreground">
              Next Payment: {format(parseISO(subscription.next_due_date), 'PP')}
            </p>
            <div className="flex gap-2 mt-2">
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
              {subscription.is_active && (
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                    subscription.is_paid_this_cycle
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-yellow-500/20 text-yellow-500',
                  )}
                >
                  {subscription.is_paid_this_cycle ? 'Paid' : 'Pending Payment'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subscription.id);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subscription.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t p-4 bg-muted/10 rounded-b-lg animate-in slide-in-from-top-2 duration-200">
          <SubscriptionPaymentHistory subscriptionId={subscription.id} />
        </div>
      )}
    </li>
  );
};
