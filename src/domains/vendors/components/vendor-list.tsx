import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { Loader2, Store } from 'lucide-react';
import type { I_Vendor, I_VendorsParams } from '@/domains/vendors/types/types-and-interfaces';
import { useDeleteVendor } from '@/domains/vendors/hooks/index';
import { PageHeader } from '@/domains/global/components';
import { VendorItem } from '@/domains/vendors/components/vendor-item';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';

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
  onParamsChange: (params: I_VendorsParams | ((prev: I_VendorsParams) => I_VendorsParams)) => void;
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
  const deleteVendorMutation = useDeleteVendor();
  const [vendorToDelete, setVendorToDelete] = useState<I_Vendor | null>(null);

  const handleEdit = (vendorId: string) => {
    (navigate as any)({
      search: (prev: any) => ({ ...prev, drawer: 'vendor-edit', vendorId }),
    });
  };

  const handleDelete = (id: string) => {
    setVendorToDelete(vendors.find(vendor => vendor.id === id) ?? null);
  };

  const confirmDelete = () => {
    if (!vendorToDelete) return;
    deleteVendorMutation.mutate(vendorToDelete.id, {
      onSuccess: () => setVendorToDelete(null),
    });
  };

  const handlePageChange = (page: number) => {
    onParamsChange(prev => ({ ...prev, page }));
  };

  if (isError) {
    return (
      <div data-ui="vendor-list" className="space-y-6 pb-8">
        <PageHeader
          title="Vendors"
          icon={Store}
          onAdd={() =>
            (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })
          }
          addButtonLabel="Add Vendor"
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-destructive">Failed to load vendors</p>
        </div>
      </div>
    );
  }

  if (vendors.length === 0 && !isLoading && !isPlaceholderData) {
    return (
      <div data-ui="vendor-list" className="space-y-6 pb-8">
        <PageHeader
          title="Vendors"
          icon={Store}
          onAdd={() =>
            (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })
          }
          addButtonLabel="Add Vendor"
        />
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-muted-foreground">No vendors found.</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding a new vendor.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ui="vendor-list" className="space-y-6 pb-8">
      <PageHeader
        title="Vendors"
        icon={Store}
        onAdd={() =>
          (navigate as any)({ search: (prev: any) => ({ ...prev, drawer: 'vendor-create' }) })
        }
        addButtonLabel="Add Vendor"
      />
      <p className="text-sm text-muted-foreground">
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
      </p>

      {isLoading && !isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} vendors
              {isPlaceholderData && <span className="text-xs ml-2">(Previous data shown)</span>}
            </span>
          </div>
          <div className={isPlaceholderData ? 'pointer-events-none opacity-50' : ''}>
            <Pagination
              currentPage={meta.page}
              totalPages={Math.ceil(meta.total / (params.per_page || 1))}
              hasNext={meta.has_next && !isPlaceholderData}
              hasPrevious={meta.has_previous && !isPlaceholderData}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(vendorToDelete)}
        onOpenChange={open => !open && setVendorToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {vendorToDelete?.name}?</DialogTitle>
            <DialogDescription>
              This cannot be undone and may affect associated subscriptions and transactions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteVendorMutation.isPending}
            >
              {deleteVendorMutation.isPending ? 'Deleting…' : 'Delete vendor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
