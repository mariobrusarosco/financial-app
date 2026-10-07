import { Outlet } from '@tanstack/react-router';
import { useAccount } from '@/domains/accounts/hooks/use-account';
import AccountHeading from '@/domains/accounts/components/account-heading';
import AccountOverview from '@/domains/accounts/components/account-overview';
import { Skeleton } from '@/domains/ui-system/components/skeleton';

interface AccountLayoutProps {
  slug: string;
}

export const AccountLayout = ({ slug }: AccountLayoutProps) => {
  const { isLoading, error } = useAccount(slug);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <div>
          <p className="font-semibold text-destructive">We couldn&apos;t load this account.</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8" data-ui="account-layout">
      <AccountHeading slug={slug} />
      <AccountOverview slug={slug} />
      <Outlet />
    </div>
  );
};
