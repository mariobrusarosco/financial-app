import { Button } from '@/domains/ui-system/components/button';
import { Minus, Plus, Target, TrendingUp } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';

export const DashboardIndexScreen = () => {
  const { openTransactionCreate } = useGlobalUIState();

  return (
    <div data-ui="dashboard-index-screen" className="p-6">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={openTransactionCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Overview of your income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$15,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="h-[200px] w-full mt-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-12 w-12 text-rose-500" />
            <span className="ml-2 text-muted-foreground">Line Chart Placeholder</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Move Goal</CardTitle>
          <CardDescription>Set your daily activity goal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full">
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold tracking-tighter">200</div>
              <div className="text-[0.70rem] uppercase text-muted-foreground">Calories/day</div>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <div className="h-[100px] w-full mb-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center">
            <Target className="h-8 w-8 text-rose-500" />
            <span className="ml-2 text-muted-foreground">Activity Chart Placeholder</span>
          </div>
          <Button className="w-full" variant="default">
            Set Goal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
