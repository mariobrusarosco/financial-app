/**
 * Query Utils - Placeholder
 * 
 * This file will contain utilities for TanStack Query integration.
 * We'll implement these functions properly when we set up TanStack Query.
 */

import { ApiError } from './client';
import { CACHE_CONFIG } from './config';

/**
 * Default query options for TanStack Query
 */
export const defaultQueryOptions = {
  staleTime: CACHE_CONFIG.defaultStaleTime,
  gcTime: CACHE_CONFIG.defaultCacheTime,
  retry: (failureCount: number, error: unknown) => {
    // Don't retry on 4xx errors (client errors)
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry 3 times for other errors
    return failureCount < 3;
  },
};

/**
 * Default mutation options for TanStack Query
 */
export const defaultMutationOptions = {
  retry: (failureCount: number, error: unknown) => {
    // Don't retry on 4xx errors (client errors)
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry 2 times for other errors
    return failureCount < 2;
  },
};

/**
 * Format error message from API error
 */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.data?.errors && Object.keys(error.data.errors).length > 0) {
      // Format validation errors
      return Object.entries(error.data.errors)
        .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
        .join('\n');
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Type for custom query keys
 */
export type QueryKeyT = readonly [string, ...unknown[]];

/**
 * Interface for items with an ID
 */
export interface IdentifiableItem {
  id: string;
  [key: string]: any;
}

// Note: The following functions will be properly implemented
// when we set up TanStack Query. These are just placeholders.

/**
 * Helper function to invalidate queries by key pattern
 */
export function invalidateQueries(
  queryClient: any,
  queryKey: string | string[],
): Promise<void> {
  console.log('Invalidating queries:', queryKey);
  return Promise.resolve();
}

/**
 * Helper to handle optimistic updates for create operations
 */
export function handleOptimisticCreate<T extends IdentifiableItem>(
  queryClient: any,
  queryKey: string,
  newItem: T,
): void {
  console.log('Optimistic create:', queryKey, newItem);
}

/**
 * Helper to handle optimistic updates for update operations
 */
export function handleOptimisticUpdate<T extends IdentifiableItem>(
  queryClient: any,
  queryKey: string,
  updatedItem: T,
): void {
  console.log('Optimistic update:', queryKey, updatedItem);
}

/**
 * Helper to handle optimistic updates for delete operations
 */
export function handleOptimisticDelete<T extends IdentifiableItem>(
  queryClient: any,
  queryKey: string,
  itemId: string,
): void {
  console.log('Optimistic delete:', queryKey, itemId);
} 