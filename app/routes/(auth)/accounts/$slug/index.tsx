import { createFileRoute } from '@tanstack/react-router';
import { RecentTransactions } from '@/domains/accounts/components/recent-transactions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Route = createFileRoute('/(auth)/accounts/$slug/')({
  component: AccountOverviewComponent,
});

function AccountOverviewComponent() {
  const { slug } = Route.useParams();

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common account actions and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <ArrowUpRight className="h-5 w-5 mb-2 text-green-600" />
              <span className="font-semibold">Add Deposit</span>
              <span className="text-sm text-muted-foreground">Record new funds</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <ArrowDownRight className="h-5 w-5 mb-2 text-red-600" />
              <span className="font-semibold">Record Withdrawal</span>
              <span className="text-sm text-muted-foreground">Track outgoing funds</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingUp className="h-5 w-5 mb-2 text-blue-600" />
              <span className="font-semibold">View Analytics</span>
              <span className="text-sm text-muted-foreground">Performance insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
