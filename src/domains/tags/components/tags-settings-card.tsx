import { useState } from 'react';
import { Pencil, Plus, Save, Tags, Trash2, X } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { Surface } from '@/domains/global/components/surface';
import { useCashflowViews } from '@/domains/cashflow/hooks/use-cashflow-views';
import { findViewGroupsUsingTag } from '@/domains/cashflow/utils/cashflow-views';
import { useTags } from '@/domains/tags/hooks/use-tags';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';

export const TagsSettingsCard = () => {
  const [tagName, setTagName] = useState('');
  const {
    tags: { query: tagsQuery, actions: tagActions },
  } = useTags({ includeInactive: true });

  const tags = tagsQuery.data ?? [];
  const { query: viewsQuery } = useCashflowViews();
  // Tag waiting for confirmation because one or more Cashflow views use it
  const [tagToDeactivate, setTagToDeactivate] = useState<I_Tag | null>(null);
  const viewGroupsUsingTag = tagToDeactivate
    ? findViewGroupsUsingTag(viewsQuery.data ?? [], tagToDeactivate.id)
    : [];

  const requestDeactivate = (tag: I_Tag) => {
    if (findViewGroupsUsingTag(viewsQuery.data ?? [], tag.id).length > 0) {
      setTagToDeactivate(tag);
      return;
    }
    tagActions.deleteTag(tag.id);
  };

  const confirmDeactivate = () => {
    if (!tagToDeactivate) return;
    tagActions.deleteTag(tagToDeactivate.id);
    setTagToDeactivate(null);
  };

  const createTag = () => {
    const name = tagName.trim();
    if (!name) return;
    tagActions.createTag({ name }, { onSuccess: () => setTagName('') });
  };

  return (
    <Surface className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand/10 p-2 text-brand">
          <Tags className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Tags</h2>
          <p className="text-sm text-muted-foreground">
            Reusable labels for your transactions and subscriptions.
          </p>
        </div>
      </div>

      <section className="space-y-3 rounded-xl border p-4">
        <h3 className="text-sm font-semibold">Tags</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={tagName}
            onChange={event => setTagName(event.target.value)}
            placeholder="Tag name"
          />
          <Button type="button" onClick={createTag} disabled={!tagName.trim()}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {tags.map(tag => (
            <TagRow
              key={tag.id}
              tag={tag}
              onRename={name => tagActions.updateTag({ tagId: tag.id, payload: { name } })}
              onDeactivate={() => requestDeactivate(tag)}
            />
          ))}
        </div>
      </section>

      <Dialog
        open={tagToDeactivate !== null}
        onOpenChange={open => !open && setTagToDeactivate(null)}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate &ldquo;{tagToDeactivate?.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              It&apos;s used in your Cashflow views:{' '}
              <span className="font-medium text-foreground">
                {viewGroupsUsingTag
                  .map(({ viewName, groupName }) => `${viewName} › ${groupName}`)
                  .join(', ')}
              </span>
              . Once deactivated, you can&apos;t add it to new expenses or groups.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTagToDeactivate(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeactivate}>
              Deactivate tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Surface>
  );
};

const TagRow = ({
  tag,
  onRename,
  onDeactivate,
}: {
  tag: I_Tag;
  onRename: (name: string) => void;
  onDeactivate: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tag.name);

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-3">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <Input value={name} onChange={event => setName(event.target.value)} className="h-8" />
        ) : (
          <p className="truncate text-sm font-medium">
            {tag.name} {!tag.is_active && <span className="text-muted-foreground">(inactive)</span>}
          </p>
        )}
      </div>
      {tag.is_active && (
        <div className="flex items-center">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  onRename(name.trim());
                  setIsEditing(false);
                }}
                aria-label={`Save ${tag.name}`}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button type="button" variant="ghost" size="icon" onClick={onDeactivate}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
