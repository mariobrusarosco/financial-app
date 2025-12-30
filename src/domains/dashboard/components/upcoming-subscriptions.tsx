import { useSubscriptions } from '@/domains/subscriptions/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { Badge } from '@/domains/ui-system/components/badge';
import { Button } from '@/domains/ui-system/components/button';
import { Loader2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const UpcomingSubscriptions = () => {
  const { data, isLoading, isError } = useSubscriptions({ is_active: true });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-destructive text-sm">
          Failed to load upcoming subscriptions
        </CardContent>
      </Card>
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
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Subscriptions</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSubscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">{sub.name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(sub.next_due_date), 'MMM d, yyyy')} • {sub.amount} {sub.currency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {sub.is_paid_this_cycle ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1 px-2 py-0.5">
                    <AlertCircle className="h-3 w-3" />
                    Due
                  </Badge>
                )}
                {!sub.is_paid_this_cycle && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};