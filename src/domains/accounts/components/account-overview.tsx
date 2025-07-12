import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { useAccount } from '@/domains/accounts/hooks/use-account';

interface AccountOverviewProps {
  slug: string;
}

const AccountOverview = ({ slug }: AccountOverviewProps) => {
  const { data: account } = useAccount(slug);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>Current account balance and details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold text-primary">
              {account?.currency} {account?.balance?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Currency</p>
            <p className="text-lg font-semibold">{account?.currency}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p className="text-lg font-semibold capitalize">{account?.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Broker</p>
            <p className="text-lg font-semibold">{account?.broker?.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOverview;
