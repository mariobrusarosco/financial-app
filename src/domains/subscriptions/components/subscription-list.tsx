import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { Loader2, Repeat } from 'lucide-react';
import type { I_Subscription, I_SubscriptionsParams } from '../types/types-and-interfaces';
import { useDeleteSubscription } from '../hooks';
import { toast } from 'sonner';
import { PageHeader } from '@/domains/global/components';
import { CardDescription } from '@/domains/ui-system/components/card';
import { SubscriptionItem } from './subscription-item';
import type { AuthSearchParams } from '@/routes/(auth)/route'; // Import AuthSearchParams

interface SubscriptionListProps {
  subscriptions: I_Subscription[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
  params: I_SubscriptionsParams;
  onParamsChange: (
    params: I_SubscriptionsParams | ((prev: I_SubscriptionsParams) => I_SubscriptionsParams)
  ) => void;
}

export const SubscriptionList = ({
  subscriptions,
  meta,
  isLoading,
  isError,
  isPlaceholderData,
  params,
  onParamsChange,
}: SubscriptionListProps) => {
  const navigate = useNavigate();
  const { mutate: deleteSubscriptionMutation } = useDeleteSubscription();

  const handleEdit = (subscriptionId: string) => {
    navigate({
      search: (prev: AuthSearchParams) => ({ ...prev, drawer: 'subscription-edit', subscriptionId }),
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription? This action cannot be undone.')) {
      deleteSubscriptionMutation(id, {
        onSuccess: () => {
          toast.success('Subscription deleted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to delete subscription.', { description: error.message });
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    onParamsChange(prev => ({ ...prev, page }));
  };

  if (isError) {
    return (
      <div data-ui="subscription-list" className="py-4 space-y-5 rounded-3xl">
        <PageHeader
          title="Subscriptions"
          icon={Repeat}
          onAdd={() => navigate({ search: (prev: AuthSearchParams) => ({ ...prev, drawer: 'subscription-create' }) })}
          addButtonLabel="Add Subscription"
        />
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load subscriptions</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0 && !isLoading && !isPlaceholderData) {
    return (
      <div data-ui="subscription-list" className="py-4 space-y-5 rounded-3xl">
        <PageHeader
          title="Subscriptions"
          icon={Repeat}
          onAdd={() => navigate({ search: (prev: AuthSearchParams) => ({ ...prev, drawer: 'subscription-create' }) })}
          addButtonLabel="Add Subscription"
        />
        <div className="text-center py-8">
          <p className="text-muted-foreground">No subscriptions found.</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding a new subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ui="subscription-list" className="py-4 space-y-5 rounded-3xl">
      <PageHeader
        title="Subscriptions"
        icon={Repeat}
        onAdd={() => navigate({ search: (prev: AuthSearchParams) => ({ ...prev, drawer: 'subscription-create' }) })}
        addButtonLabel="Add Subscription"
      />
      <CardDescription>
        {isLoading && !isPlaceholderData ? (
          'Loading subscriptions...'
        ) : (
          <>
            {meta ? `${meta.total} subscriptions found` : 'Manage your list of recurring subscriptions.'}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Previous data shown)</span>
            )}
          </>
        )}
      </CardDescription>

      {isLoading && !isPlaceholderData ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ul className="space-y-3">
          {subscriptions.map(subscription => (
            <SubscriptionItem
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {meta && meta.total > (params.per_page || 1) && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} subscriptions
              {isPlaceholderData && <span className="text-xs ml-2">(Previous data shown)</span>}
            </span>
          </div>
          <Pagination
            currentPage={meta.page}
            totalPages={Math.ceil(meta.total / (params.per_page || 1))}
            hasNext={meta.has_next && !isPlaceholderData}
            hasPrevious={meta.has_previous && !isPlaceholderData}
            onPageChange={handlePageChange}
            className={isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}
          />
        </div>
      )}
    </div>
  );
};
