import { Outlet, Link } from '@tanstack/react-router';
import { useAccount } from '@/domains/accounts/hooks/use-account';

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
    <div className="md:pr-4 max-h-full" data-ui="account-layout">
      <AccountHeading slug={slug} />
      <AccountOverview slug={slug} />
      <Separator className="my-4" />

      <Outlet />
    </div>
  );
};
