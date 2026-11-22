import type {
  I_CashflowViewGroupResponse,
  I_CashflowViewGroupSummaryResponse,
  I_CashflowViewResponse,
} from '@/domains/cashflow/types/index';

const LAST_VIEW_STORAGE_KEY = 'cashflow:last-view-id';
const PATH_SEPARATOR = ' › ';

/** The view to open: the last one used if it still exists, otherwise the first one. */
export const resolveSelectedViewId = (
  views: I_CashflowViewResponse[],
  preferredViewId: string | null
): string | undefined => views.find(view => view.id === preferredViewId)?.id ?? views[0]?.id;

/** Every group and sub-group of a view, each with its path, e.g. "Home › Bills". */
export const listViewGroups = (groups: I_CashflowViewGroupResponse[], parentPath = '') =>
  groups.flatMap((group): { group: I_CashflowViewGroupResponse; path: string }[] => {
    const path = parentPath ? `${parentPath}${PATH_SEPARATOR}${group.name}` : group.name;
    return [{ group, path }, ...listViewGroups(group.groups, path)];
  });

/** Every view group (or sub-group) that contains `tagId`, e.g. to warn before deactivating that tag. */
export const findViewGroupsUsingTag = (views: I_CashflowViewResponse[], tagId: string) =>
  views.flatMap(view =>
    listViewGroups(view.groups)
      .filter(({ group }) => group.tag_ids.includes(tagId))
      .map(({ path }) => ({ viewName: view.name, groupName: path }))
  );

/** Total and count of every group and sub-group in a view summary, by group id. */
export const indexSummaryTotals = (
  groups: I_CashflowViewGroupSummaryResponse[]
): Map<string, { total: number; count: number }> =>
  new Map(
    flattenSummaryGroups(groups).map(group => [
      group.group_id,
      { total: Number(group.total), count: group.count },
    ])
  );

const flattenSummaryGroups = (
  groups: I_CashflowViewGroupSummaryResponse[]
): I_CashflowViewGroupSummaryResponse[] =>
  groups.flatMap(group => [group, ...flattenSummaryGroups(group.groups)]);

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
