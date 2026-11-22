import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Layers, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { cn } from '@/domains/ui-system/utils';
import { CashflowViewDialog } from '@/domains/cashflow/components/views/cashflow-view-dialog';
import { CashflowViewGroup } from '@/domains/cashflow/components/views/cashflow-view-group';
import {
  useCashflowViewOverlaps,
  useCashflowViews,
  useCashflowViewSummary,
} from '@/domains/cashflow/hooks/use-cashflow-views';
import type {
  I_CashflowViewGroupResponse,
  I_CashflowViewReportParams,
  I_CashflowViewResponse,
} from '@/domains/cashflow/types/index';
import {
  indexSummaryTotals,
  listViewGroups,
  readLastViewId,
  resolveSelectedViewId,
  saveLastViewId,
} from '@/domains/cashflow/utils/cashflow-views';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

type T_EditorState = { mode: 'create' } | { mode: 'edit'; view: I_CashflowViewResponse } | null;

interface CashflowViewsPanelProps {
  from?: string;
  to?: string;
}

export const CashflowViewsPanel = ({ from, to }: CashflowViewsPanelProps) => {
  const [preferredViewId, setPreferredViewId] = useState<string | null>(() => readLastViewId());
  const [editorState, setEditorState] = useState<T_EditorState>(null);
  const [viewToDelete, setViewToDelete] = useState<I_CashflowViewResponse | null>(null);
  const [isOverlapsOpen, setIsOverlapsOpen] = useState(false);

  const { query: viewsQuery, mutations } = useCashflowViews();
  const views = useMemo(() => viewsQuery.data ?? [], [viewsQuery.data]);
  const selectedViewId = resolveSelectedViewId(views, preferredViewId);
  const selectedView = views.find(view => view.id === selectedViewId);
  const params: I_CashflowViewReportParams = {
    date_from: from,
    date_to: to,
    movement_type: 'expense',
  };

  useEffect(
    function RememberSelectedView() {
      if (selectedViewId) saveLastViewId(selectedViewId);
    },
    [selectedViewId]
  );

  const confirmDelete = () => {
    if (!viewToDelete) return;
    mutations.delete.mutate(viewToDelete.id, { onSuccess: () => setViewToDelete(null) });
  };

  return (
    <section
      data-ui="cashflow-views-panel"
      className="space-y-5 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-panel)]"
    >
      <div>
        <h3 className="text-lg font-semibold text-primary">Views</h3>
        <p className="text-sm text-muted-foreground">
          Look at your expenses from different angles. Group totals can overlap, so they aren&apos;t
          added up.
        </p>
      </div>

      {viewsQuery.isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading views…
        </div>
      ) : viewsQuery.isError ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm font-medium">Views aren&apos;t available right now</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn&apos;t load your views. Try again in a moment.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => void viewsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : views.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm font-medium">No views yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            For example, a &ldquo;By person&rdquo; view with a Family group (rent, food) and a
            Personal group.
          </p>
          <Button type="button" className="mt-4" onClick={() => setEditorState({ mode: 'create' })}>
            <Plus className="h-4 w-4" />
            Create your first view
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Views">
              {views.map(view => (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={view.id === selectedViewId}
                  onClick={() => setPreferredViewId(view.id)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    view.id === selectedViewId
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {view.name}
                </button>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditorState({ mode: 'create' })}
              >
                <Plus className="h-4 w-4" />
                New view
              </Button>
            </div>

            {selectedView && (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOverlapsOpen(true)}
                >
                  <Layers className="h-4 w-4" />
                  Check overlaps
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditorState({ mode: 'edit', view: selectedView })}
                  aria-label={`Edit ${selectedView.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewToDelete(selectedView)}
                  aria-label={`Delete ${selectedView.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {selectedView && (
            <ViewContent
              view={selectedView}
              params={params}
              onEdit={() => setEditorState({ mode: 'edit', view: selectedView })}
            />
          )}
        </>
      )}

      <CashflowViewDialog
        open={editorState !== null}
        onOpenChange={open => !open && setEditorState(null)}
        view={editorState?.mode === 'edit' ? editorState.view : undefined}
        onSaved={savedView => setPreferredViewId(savedView.id)}
      />

      <OverlapsDialog
        open={isOverlapsOpen}
        onOpenChange={setIsOverlapsOpen}
        view={selectedView}
        params={params}
      />

      <Dialog open={viewToDelete !== null} onOpenChange={open => !open && setViewToDelete(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{viewToDelete?.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              Only the view is removed. Your tags and transactions stay as they are.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setViewToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={mutations.delete.isPending}
            >
              {mutations.delete.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete view
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const ViewContent = ({
  view,
  params,
  onEdit,
}: {
  view: I_CashflowViewResponse;
  params: I_CashflowViewReportParams;
  onEdit: () => void;
}) => {
  const summaryQuery = useCashflowViewSummary(view.id, params);
  const totalsByGroupId = indexSummaryTotals(summaryQuery.data?.groups ?? []);
  const totalsOf = (groupId: string) => totalsByGroupId.get(groupId) ?? { total: 0, count: 0 };
  const ungrouped = {
    total: Number(summaryQuery.data?.ungrouped.total ?? 0),
    count: summaryQuery.data?.ungrouped.count ?? 0,
  };
  // A parent is never smaller than its sub-groups, so top-level groups set the scale
  const maxGroupTotal = Math.max(
    0,
    ungrouped.total,
    ...view.groups.map(group => totalsOf(group.id).total)
  );
  const barWidthOf = (total: number) => (maxGroupTotal > 0 ? (total / maxGroupTotal) * 100 : 0);
  const ungroupedLine = (
    <CashflowViewGroup
      viewId={view.id}
      total={ungrouped.total}
      count={ungrouped.count}
      barWidth={barWidthOf(ungrouped.total)}
      params={params}
    />
  );
  const renderGroup = (group: I_CashflowViewGroupResponse) => {
    const { total, count } = totalsOf(group.id);

    return (
      <CashflowViewGroup
        // Group ids change after each save, which also collapses the group
        key={group.id}
        viewId={view.id}
        group={group}
        total={total}
        count={count}
        barWidth={barWidthOf(total)}
        params={params}
      >
        {group.groups.length > 0 && (
          <ul className="ml-4 space-y-1 border-l border-border/70 pl-2">
            {group.groups.map(renderGroup)}
          </ul>
        )}
      </CashflowViewGroup>
    );
  };

  const noGroupsHint = (
    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      This view has no groups yet.{' '}
      <button type="button" onClick={onEdit} className="font-medium text-brand hover:underline">
        Add a group
      </button>
    </div>
  );

  if (summaryQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Calculating totals…
      </div>
    );
  }

  if (summaryQuery.isError) {
    return (
      <p className="py-4 text-sm text-destructive">Couldn&apos;t load this view. Try again.</p>
    );
  }

  if (view.groups.length === 0) {
    return (
      <div className="space-y-3">
        {noGroupsHint}
        <ul>{ungroupedLine}</ul>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-2">{view.groups.map(renderGroup)}</ul>
      {/* Its own total; never added to the groups (they can share expenses) */}
      <ul className="border-t border-border/70 pt-2">{ungroupedLine}</ul>
    </div>
  );
};

const OverlapsDialog = ({
  open,
  onOpenChange,
  view,
  params,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: I_CashflowViewResponse;
  params: I_CashflowViewReportParams;
}) => {
  const overlapsQuery = useCashflowViewOverlaps(view?.id, params, { enabled: open });
  const overlaps = overlapsQuery.data ?? [];
  // Sub-groups show with their parent, e.g. "Home › Bills"
  const groupPaths = new Map(
    listViewGroups(view?.groups ?? []).map(({ group, path }) => [group.id, path])
  );
  const groupName = (groupId: string) => groupPaths.get(groupId) ?? 'Unknown group';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Overlaps in &ldquo;{view?.name}&rdquo;</DialogTitle>
          <DialogDescription>
            Expenses that appear in more than one group of this view.
          </DialogDescription>
        </DialogHeader>

        {overlapsQuery.isLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking…
          </div>
        ) : overlapsQuery.isError ? (
          <p className="py-6 text-sm text-destructive">Couldn&apos;t check overlaps. Try again.</p>
        ) : overlaps.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No overlaps. Every expense is counted in only one group.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              {overlaps.length} {overlaps.length === 1 ? 'expense appears' : 'expenses appear'} in
              more than one group
            </p>
            <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border">
              {overlaps.map(overlap => (
                <li key={overlap.transaction_id} className="space-y-1 p-3">
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium">{overlap.description}</span>
                    <span className="shrink-0 font-semibold">
                      {currencyFormatter.format(Number(overlap.amount))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(overlap.date), 'PP')} ·{' '}
                    {overlap.group_ids.map(groupName).join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
