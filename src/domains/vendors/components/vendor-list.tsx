import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { Loader2, Store } from 'lucide-react';
import type { I_Vendor, I_VendorsParams } from '../types/types-and-interfaces';
import { useDeleteVendor } from '../hooks';
import { toast } from 'sonner';
import { PageHeader } from '@/domains/global/components';
import { CardDescription } from '@/domains/ui-system/components/card';
import { VendorItem } from './vendor-item';

interface VendorListProps {
  vendors: I_Vendor[];
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
  params: I_VendorsParams;
  onParamsChange: (
    params: I_VendorsParams | ((prev: I_VendorsParams) => I_VendorsParams)
  ) => void;
}

export const VendorList = ({
  vendors,
  meta,
  isLoading,
  isError,
  isPlaceholderData,
  params,
  onParamsChange,
}: VendorListProps) => {
  const navigate = useNavigate();
  const { mutate: deleteVendorMutation } = useDeleteVendor();

  const handleEdit = (vendorId: string) => {
    (navigate as any)({
      search: (prev: any) => ({ ...prev, drawer: 'vendor-edit', vendorId }),
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone and may affect associated subscriptions and transactions.')) {
      deleteVendorMutation(id, {
        onSuccess: () => {
          toast.success('Vendor deleted successfully.');
        },
        onError: (error) => {
          toast.error('Failed to delete vendor.', { description: error.message });
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    onParamsChange(prev => ({ ...prev, page }));
  };

  if (isError) {
    return (
      <div data-ui="vendor-list" className="py-4 space-y-5 rounded-3xl">
        <PageHeader
          title="Vendors"
          icon={Store}
          onAdd={() => (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })}
          addButtonLabel="Add Vendor"
        />
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load vendors</p>
        </div>
      </div>
    );
  }

  if (vendors.length === 0 && !isLoading && !isPlaceholderData) {
    return (
      <div data-ui="vendor-list" className="py-4 space-y-5 rounded-3xl">
        <PageHeader
          title="Vendors"
          icon={Store}
          onAdd={() => (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })}
          addButtonLabel="Add Vendor"
        />
        <div className="text-center py-8">
          <p className="text-muted-foreground">No vendors found.</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding a new vendor.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ui="vendor-list" className="py-4 space-y-5 rounded-3xl">
      <PageHeader
        title="Vendors"
        icon={Store}
        onAdd={() => (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })}
        addButtonLabel="Add Vendor"
      />
      <CardDescription>
        {isLoading && !isPlaceholderData ? (
          'Loading vendors...'
        ) : (
          <>
            {meta ? `${meta.total} vendors found` : 'Manage your list of vendors and payees.'}
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
          {vendors.map(vendor => (
            <VendorItem
              key={vendor.id}
              vendor={vendor}
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
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} vendors
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