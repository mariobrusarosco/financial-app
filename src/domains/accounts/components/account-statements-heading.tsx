import { Link, useParams, useLocation } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { Upload, History } from 'lucide-react';

interface AccountStatementsHeadingProps {
  accountId?: string;
}

export const AccountStatementsHeading = ({ accountId: _ }: AccountStatementsHeadingProps) => {
  const params = useParams({ from: '/(auth)/accounts/$slug/statements' });
  const location = useLocation();

  const currentTab = location.pathname.includes('/upload')
    ? 'upload'
    : location.pathname.includes('/history')
      ? 'history'
      : 'upload';

  return (
    <div className="flex items-center justify-between mb-6" data-ui="account-statements-heading">
      <div>
        <h1 className="text-3xl font-thin">Account Statements</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/accounts/$slug/statements/upload"
          params={{ slug: params.slug }}
          className="no-underline"
        >
          <Button
            variant={currentTab === 'upload' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </Link>

        <Link
          to="/accounts/$slug/statements/history"
          params={{ slug: params.slug }}
          className="no-underline"
        >
          <Button
            variant={currentTab === 'history' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            History
          </Button>
        </Link>
      </div>
    </div>
  );
};
