import type { I_CashflowViewResponse } from '@/domains/cashflow/types/index';

const LAST_VIEW_STORAGE_KEY = 'cashflow:last-view-id';

/** The view to open: the last one used if it still exists, otherwise the first one. */
export const resolveSelectedViewId = (
  views: I_CashflowViewResponse[],
  preferredViewId: string | null
): string | undefined => views.find(view => view.id === preferredViewId)?.id ?? views[0]?.id;

/** Every view group that contains `tagId`, e.g. to warn before deactivating that tag. */
export const findViewGroupsUsingTag = (views: I_CashflowViewResponse[], tagId: string) =>
  views.flatMap(view =>
    view.groups
      .filter(group => group.tag_ids.includes(tagId))
      .map(group => ({ viewName: view.name, groupName: group.name }))
  );

// Browser storage can be unavailable (private mode, blocked storage); fall back silently
export const readLastViewId = (): string | null => {
  try {
    return window.localStorage.getItem(LAST_VIEW_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const saveLastViewId = (viewId: string) => {
  try {
    window.localStorage.setItem(LAST_VIEW_STORAGE_KEY, viewId);
  } catch {
    // Not critical: Cashflow just opens the first view next time
  }
};
