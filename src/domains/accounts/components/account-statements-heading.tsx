import { Link, useParams, useLocation } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { Upload, History } from 'lucide-react';
import { Route } from '@/routes/(auth)/route';

interface AccountStatementsHeadingProps {
  accountId?: string;
}

export const AccountStatementsHeading = ({ accountId: _ }: AccountStatementsHeadingProps) => {
  const params = useParams({ from: '/(auth)/accounts/$slug/statements' });
  const location = useLocation();
  // Keep the account's Reporting period when switching between Upload and History
  const { from, to } = Route.useSearch();

  const currentTab = location.pathname.includes('/upload')
    ? 'upload'
    : location.pathname.includes('/history')
      ? 'history'
      : 'upload';

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)] sm:flex-row sm:items-center sm:justify-between"
      data-ui="account-statements-heading"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
          Account statements
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload and review imported statements</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/accounts/$slug/statements/upload"
          params={{ slug: params.slug }}
          search={{ from, to }}
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
          search={{ from, to }}
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
