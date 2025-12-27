import { useState, useMemo } from 'react';
import { Route } from '@/routes/(auth)/route'; // Import Route for global search
import { useVendors } from '../hooks';
import { VendorList } from '../components';
import type { I_VendorsParams } from '../types/types-and-interfaces';

const ITEMS_PER_PAGE = 20;

export const VendorsMainScreen = () => {
  const { from, to } = Route.useSearch(); // Get global dates
  const [params, setParams] = useState<I_VendorsParams>({
    page: 1,
    per_page: ITEMS_PER_PAGE,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from, // Include global date filter
      date_to: to,     // Include global date filter
    }),
    [params, from, to] // Add from, to to dependencies
  );

  const { data, isLoading, isError, isPlaceholderData } = useVendors(mergedParams);

  const handleParamsChange = (
    newParams: I_VendorsParams | ((prev: I_VendorsParams) => I_VendorsParams)
  ) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: updated.page || 1 };
    });
  };

  return (
    <VendorList
      vendors={data?.data || []}
      meta={data?.meta}
      isLoading={isLoading}
      isError={isError}
      isPlaceholderData={isPlaceholderData}
      params={mergedParams}
      onParamsChange={handleParamsChange}
    />
  );
};
