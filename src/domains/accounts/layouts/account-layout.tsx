import { Outlet, Link } from '@tanstack/react-router';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import { Button } from '@/domains/ui-system/components/button';
import { ArrowLeft } from 'lucide-react';
import AccountQuickActions from '@/domains/accounts/components/account-quick-actions';
import AccountHeading from '@/domains/accounts/components/account-heading';
import AccountOverview from '@/domains/accounts/components/account-overview';
import { Separator } from '@/domains/ui-system/components/separator';

interface AccountLayoutProps {
  slug: string;
}

export const AccountLayout = ({ slug }: AccountLayoutProps) => {
  const { isLoading, error } = useAccount(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ui="account-layout">
      <div className="flex items-center justify-between items-center">
        <AccountHeading slug={slug} />

        <Link to="/accounts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 justify-between items-start">
        <AccountOverview slug={slug} />
        <Separator orientation="vertical" className="h-full w-[1px] bg-border" />
        <AccountQuickActions slug={slug} />
      </div>

      <Separator className="my-4" />

      <Outlet />
    </div>
  );
};
