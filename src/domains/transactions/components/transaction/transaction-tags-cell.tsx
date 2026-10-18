import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { TagChips } from '@/domains/tags/components/tag-chips';
import { TagPicker } from '@/domains/tags/components/tag-picker';
import { TAG_QUERY_KEYS } from '@/domains/tags/api/keys';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { mergeReadableTags } from '@/domains/tags/utils/tag-selection';
import { useUpdateTransactionTags } from '@/domains/transactions/hooks/use-update-transaction-tags';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { cn } from '@/domains/ui-system/utils/index';

interface TransactionTagsCellProps {
  transaction: I_TransactionResponse;
  canEdit?: boolean;
}

export const TransactionTagsCell = ({ transaction, canEdit = false }: TransactionTagsCellProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [draftTagIds, setDraftTagIds] = useState<string[]>([]);
  // Shown optimistically after closing the picker, until the row receives fresh data
  const [pendingTagIds, setPendingTagIds] = useState<string[] | null>(null);
  const { mutate: updateTags, isPending: isSaving } = useUpdateTransactionTags();

  const transactionTags = transaction.tags ?? [];
  const displayedTagIds = pendingTagIds ?? transaction.tag_ids ?? [];

  useEffect(
    function ClearPendingTagsWhenRowRefreshes() {
      setPendingTagIds(null);
    },
    [transaction.updated_at]
  );

  const knownTags = mergeReadableTags(
    queryClient.getQueryData<I_Tag[]>(TAG_QUERY_KEYS.list(false)) ?? [],
    transactionTags
  );
  const displayedTags = displayedTagIds
    .map(tagId => knownTags.find(tag => tag.id === tagId))
    .filter((tag): tag is I_Tag => Boolean(tag));

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraftTagIds(displayedTagIds);
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
    if (haveSameTagIds(draftTagIds, displayedTagIds)) return;

    const previousPendingTagIds = pendingTagIds;
    setPendingTagIds(draftTagIds);
    updateTags(
      { transactionId: transaction.id, tagIds: draftTagIds },
      { onError: () => setPendingTagIds(previousPendingTagIds) }
    );
  };

  const tagList = <TagChips tags={displayedTags} emptyLabel={canEdit ? 'Add tags' : 'No tags'} />;

  if (!canEdit) {
    return <div className="mt-1 flex min-w-0 items-center">{tagList}</div>;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Edit tags for ${transaction.description}`}
          className={cn(
            'mt-1 -ml-1 flex max-w-full min-w-0 items-center gap-1.5 rounded-md border border-transparent px-1 py-0.5 text-left transition-colors',
            'hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'data-[state=open]:border-border data-[state=open]:bg-muted/50'
          )}
        >
          {tagList}
          {isSaving && <Loader2 className="h-3 w-3 shrink-0 animate-spin text-muted-foreground" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,22rem)] p-0" align="start">
        <TagPicker
          value={draftTagIds}
          onValueChange={setDraftTagIds}
          historicalTags={transactionTags}
        />
      </PopoverContent>
    </Popover>
  );
};

const haveSameTagIds = (left: string[], right: string[]) =>
  left.length === right.length && left.every(tagId => right.includes(tagId));
