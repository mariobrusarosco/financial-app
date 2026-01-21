import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { Badge } from '@/domains/ui-system/components/badge';
import { Button } from '@/domains/ui-system/components/button';
import { Loader2, CheckCircle2, AlertCircle, Repeat } from 'lucide-react';
import { formatDateMedium, formatCurrencyAmount } from '@/domains/global/utils/formatting';

export const UpcomingSubscriptions = () => {
  const { data, isLoading, isError } = useSubscriptions({ is_active: true });

  if (isLoading) {
    return (
      <div className=" bg-foreground rounded-md p-6 ">
        <div className="pt-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className=" bg-foreground rounded-md p-6  ">
        <div className="pt-6 text-center text-destructive text-sm">
          Failed to load subscriptions
        </div>
      </div>
    );
  }

  const subscriptions = data?.data || [];

  if (subscriptions.length === 0) {
    return null; // Don't show if no subscriptions
  }

  // Sort by next_due_date
  const sortedSubscriptions = [...subscriptions].sort((a, b) =>
    new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime()
  ).slice(0, 5); // Show top 5

  return (
    <div className="w-full md:w-[400px] bg-foreground rounded-md p-6">
      <div className="flex gap-4 mb-8">
        <Repeat className="text-neutral-white rounded-md bg-rose-700 p-2.5 h-10 w-10" />
        <h3 className="text-primary text-2xl font-light">Subscriptions</h3>
      </div>
      <div className="space-y-4 grid ">
        {sortedSubscriptions.map((sub) => (
          <div key={sub.id} className="flex justify-between items-center bg-neutral-white/80 rounded-sm p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-primary leading-none">{sub.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateMedium(sub.next_due_date)} • {formatCurrencyAmount(sub.amount, { currency: sub.currency })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {sub.is_paid_this_cycle ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 gap-1 px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-orange-100/90 text-orange-700 gap-1 px-2 py-0.5">
                  <AlertCircle className="h-3 w-3" />
                  Due
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};