import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';

export const MAX_SELECTED_TAGS = 20;

/**
 * Active tags win over historical ones (e.g. tags already attached to a transaction that were
 * later deactivated), so selected-but-inactive tags can still be displayed by name.
 */
export const mergeReadableTags = (activeTags: I_Tag[], historicalTags: I_Tag[]) => {
  const tagsById = new Map(historicalTags.map(tag => [tag.id, tag]));
  activeTags.forEach(tag => tagsById.set(tag.id, tag));
  return Array.from(tagsById.values());
};

/** Toggles `tag` in `selectedIds`. `limitReached` is true when the selection would exceed the max. */
export const toggleTagSelection = (
  selectedIds: string[],
  tag: I_Tag
): { value: string[]; limitReached: boolean } => {
  if (selectedIds.includes(tag.id)) {
    return { value: selectedIds.filter(tagId => tagId !== tag.id), limitReached: false };
  }

  if (selectedIds.length >= MAX_SELECTED_TAGS) {
    return { value: selectedIds, limitReached: true };
  }

  return { value: [...selectedIds, tag.id], limitReached: false };
};

export const hasTagNamed = (tags: I_Tag[], name: string) => {
  const normalizedName = normalizeTagName(name);
  return tags.some(tag => normalizeTagName(tag.name) === normalizedName);
};

const normalizeTagName = (name: string) => name.trim().toLocaleLowerCase();
