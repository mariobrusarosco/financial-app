import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { TagSelector } from '@/domains/tags/components/tag-selector';
import { useTags } from '@/domains/tags/hooks/use-tags';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { useCashflowViews } from '@/domains/cashflow/hooks/use-cashflow-views';
import type {
  I_CashflowViewGroupPayload,
  I_CashflowViewResponse,
  I_CashflowViewUpdatePayload,
} from '@/domains/cashflow/types/index';

interface I_DraftGroup extends I_CashflowViewGroupPayload {
  // Stable React key while editing; groups are sent to the API as a full list
  key: string;
}

interface CashflowViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Omit to create a new view
  view?: I_CashflowViewResponse;
  onSaved?: (view: I_CashflowViewResponse) => void;
}

export const CashflowViewDialog = ({
  open,
  onOpenChange,
  view,
  onSaved,
}: CashflowViewDialogProps) => {
  const isEditing = Boolean(view);
  const [name, setName] = useState('');
  const [groups, setGroups] = useState<I_DraftGroup[]>([]);
  const { mutations } = useCashflowViews();
  // Includes inactive tags, so groups that still use one can show its name
  const {
    tags: { query: tagsQuery },
  } = useTags({ includeInactive: true });
  const isSaving = mutations.create.isPending || mutations.update.isPending;

  useEffect(
    function ResetFormWhenOpened() {
      if (!open) return;
      setName(view?.name ?? '');
      setGroups(view ? view.groups.map(createDraftGroup) : [createDraftGroup()]);
    },
    [open, view]
  );

  const updateGroup = (key: string, changes: Partial<I_CashflowViewGroupPayload>) =>
    setGroups(current =>
      current.map(group => (group.key === key ? { ...group, ...changes } : group))
    );
  const removeGroup = (key: string) =>
    setGroups(current => current.filter(group => group.key !== key));
  const findTags = (tagIds: string[]) =>
    tagIds
      .map(tagId => tagsQuery.data?.find(tag => tag.id === tagId))
      .filter((tag): tag is I_Tag => Boolean(tag));

  const trimmedName = name.trim();
  const isGroupComplete = (group: I_DraftGroup) =>
    group.name.trim().length > 0 && group.tag_ids.length > 0;
  // Deactivated tags still count in existing views, but the API rejects saving groups with them
  const getInactiveTags = (group: I_DraftGroup) =>
    findTags(group.tag_ids).filter(tag => !tag.is_active);
  const willSendGroups = !view || !haveSameGroups(toGroupsPayload(groups), view.groups);
  const hasBlockingInactiveTags =
    willSendGroups && groups.some(group => getInactiveTags(group).length > 0);
  const canSave =
    trimmedName.length > 0 &&
    groups.every(isGroupComplete) &&
    !hasBlockingInactiveTags &&
    !isSaving;
  const close = () => onOpenChange(false);
  const handleSaved = (savedView: I_CashflowViewResponse) => {
    onSaved?.(savedView);
    close();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    const groupsPayload = toGroupsPayload(groups);

    if (!view) {
      mutations.create.mutate(
        { name: trimmedName, groups: groupsPayload },
        { onSuccess: handleSaved }
      );
      return;
    }

    // Only send what changed: `groups` replaces the whole list on the API
    const payload: I_CashflowViewUpdatePayload = {};
    if (trimmedName !== view.name) payload.name = trimmedName;
    if (!haveSameGroups(groupsPayload, view.groups)) payload.groups = groupsPayload;

    if (Object.keys(payload).length === 0) {
      close();
      return;
    }
    mutations.update.mutate({ viewId: view.id, payload }, { onSuccess: handleSaved });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit view' : 'New view'}</DialogTitle>
            <DialogDescription>
              A view arranges your tags into groups. Each group shows the expenses with all of its
              tags.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="cashflow-view-name">View name</Label>
            <Input
              id="cashflow-view-name"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="By person"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Groups</Label>
            {groups.length === 0 && (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No groups yet. Add one to start.
              </p>
            )}
            {groups.map((group, index) => (
              <div key={group.key} className="space-y-2 rounded-xl border p-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={group.name}
                    onChange={event => updateGroup(group.key, { name: event.target.value })}
                    placeholder={`Group ${index + 1} name, e.g. Family`}
                    aria-label={`Group ${index + 1} name`}
                    className="h-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGroup(group.key)}
                    aria-label={`Remove group ${group.name || index + 1}`}
                    className="h-9 w-9 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <TagSelector
                  value={group.tag_ids}
                  onValueChange={tagIds => updateGroup(group.key, { tag_ids: tagIds })}
                  historicalTags={findTags(group.tag_ids)}
                  placeholder="Select tags…"
                />
                <InactiveTagsWarning
                  tagNames={getInactiveTags(group).map(tag => tag.name)}
                  onRemove={() =>
                    updateGroup(group.key, {
                      tag_ids: group.tag_ids.filter(
                        tagId => !getInactiveTags(group).some(tag => tag.id === tagId)
                      ),
                    })
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGroups(current => [...current, createDraftGroup()])}
            >
              <Plus className="h-4 w-4" />
              Add group
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Save view' : 'Create view'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InactiveTagsWarning = ({
  tagNames,
  onRemove,
}: {
  tagNames: string[];
  onRemove: () => void;
}) => {
  if (tagNames.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
      <span className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        {tagNames.join(', ')} {tagNames.length === 1 ? 'is' : 'are'} inactive and can&apos;t be
        saved in a group.
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="font-semibold underline-offset-2 hover:underline"
      >
        Remove inactive tags
      </button>
    </div>
  );
};

const toGroupsPayload = (groups: I_DraftGroup[]): I_CashflowViewGroupPayload[] =>
  groups.map(group => ({ name: group.name.trim(), tag_ids: group.tag_ids }));

let draftGroupCounter = 0;

const createDraftGroup = (group?: I_CashflowViewGroupPayload): I_DraftGroup => ({
  key: `group-${draftGroupCounter++}`,
  name: group?.name ?? '',
  tag_ids: group?.tag_ids ?? [],
});

const haveSameGroups = (left: I_CashflowViewGroupPayload[], right: I_CashflowViewGroupPayload[]) =>
  left.length === right.length &&
  left.every(
    (group, index) =>
      group.name === right[index].name &&
      group.tag_ids.length === right[index].tag_ids.length &&
      group.tag_ids.every((tagId, tagIndex) => tagId === right[index].tag_ids[tagIndex])
  );
