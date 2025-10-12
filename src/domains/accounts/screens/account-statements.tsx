import { useLocation, Navigate } from '@tanstack/react-router';
import { AccountStatementsHeading } from '@/domains/accounts/components/account-statements-heading';
import { AccountStatementsUpload } from '@/domains/accounts/components/account-statements-upload/account-statements-upload';
import { AccountStatementsHistory } from '@/domains/accounts/components/account-statements-history';

interface AccountStatementsScreenProps {
  accountId: string;
}

export const AccountStatementsScreen = ({ accountId }: AccountStatementsScreenProps) => {
  const location = useLocation();

  // Default redirect to upload tab if we're on the base statements route
  if (location.pathname.endsWith('/statements')) {
    return <Navigate to="/accounts/$slug/statements/upload" params={{ slug: accountId }} replace />;
  }

  const currentTab = location.pathname.includes('/upload')
    ? 'upload'
    : location.pathname.includes('/history')
      ? 'history'
      : 'upload';

  return (
    <div className="space-y-6">
      <AccountStatementsHeading accountId={accountId} />

      {currentTab === 'upload' && <AccountStatementsUpload accountId={accountId} />}
      {currentTab === 'history' && <AccountStatementsHistory accountId={accountId} />}
    </div>
  );
};
