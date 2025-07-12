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

export const AccountOverviewScreen = () => {
  return (
    <div className="space-y-6">
      <RecentTransactions />
    </div>
  );
};
