import { useState, useMemo } from 'react';
import { Route } from '@/routes/(auth)/route';
import { useVendors } from '../hooks';
import { VendorList } from '../components'; // Will create this component next
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Loader2, Plus } from 'lucide-react';
import type { I_VendorsParams } from '../types/types-and-interfaces';
import { Link } from '@tanstack/react-router';
import { Surface } from '@/domains/global/components/surface';


const ITEMS_PER_PAGE = 20;

export const VendorsMainScreen = () => {
  const { from, to } = Route.useSearch(); // Global dates, though vendors are not directly date-filtered yet.
  const [params, setParams] = useState<I_VendorsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      // For now, vendors are not directly filtered by date, but keep this pattern for consistency
      // date_from: from,
      // date_to: to,
    }),
    [params, from, to]
  );

  const { data, isLoading, isError, isPlaceholderData } = useVendors(mergedParams);

  const vendors = data?.data || [];
  const meta = data?.meta;

  const handleParamsChange = (
    newParams: I_VendorsParams | ((prev: I_VendorsParams) => I_VendorsParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 }; // Reset to page 1 on filter changes
    });
  };

  if (isLoading && !isPlaceholderData) {
    return (
      <Surface data-ui="vendors-main-screen" className="w-full flex-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage your list of vendors and payees.</CardDescription>
          </div>
          <Link to="/vendors/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading vendors...</span>
        </div>
      </Surface>
    );
  }

  if (isError) {
    return (
      <Surface data-ui="vendors-main-screen" className="w-full flex-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage your list of vendors and payees.</CardDescription>
          </div>
          <Link to="/vendors/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load vendors</p>
        </div>
      </Surface>
    );
  }

  if (vendors.length === 0 && !isLoading && !isPlaceholderData) {
    return (
      <Surface data-ui="vendors-main-screen" className="w-full flex-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage your list of vendors and payees.</CardDescription>
          </div>
          <Link to="/vendors/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No vendors found.</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding a new vendor.</p>
        </div>
      </Surface>
    );
  }

  return (
    <Surface data-ui="vendors-main-screen" className="w-full flex-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            Vendors
            {isPlaceholderData && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription>
            {meta ? `${meta.total} vendors found` : 'Manage your list of vendors and payees.'}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Loading new data...)</span>
            )}
          </CardDescription>
        </div>
        <Link to="/vendors/create">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </Link>
      </div>
      <VendorList
        vendors={vendors}
        meta={meta}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        params={mergedParams}
        onParamsChange={handleParamsChange}
      />
    </Surface>
  );
};
