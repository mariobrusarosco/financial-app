import { describe, expect, it } from 'vitest';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import {
  MAX_SELECTED_TAGS,
  hasTagNamed,
  mergeReadableTags,
  toggleTagSelection,
} from './tag-selection';

const buildTag = (overrides: Partial<I_Tag>): I_Tag => ({
  id: 'tag',
  user_id: 'user',
  name: 'Tag',
  display_order: 0,
  is_active: true,
  created_at: '',
  updated_at: '',
  ...overrides,
});

const HEALTH = buildTag({ id: 'health', name: 'Health' });
const MOTHER = buildTag({ id: 'mother', name: 'Mother' });
const DELIVERY = buildTag({ id: 'delivery', name: 'Delivery' });

const ALL_TAGS = [MOTHER, HEALTH, DELIVERY];

describe('toggleTagSelection', () => {
  it('adds and removes a tag', () => {
    const added = toggleTagSelection([], HEALTH);
    expect(added).toEqual({ value: ['health'], limitReached: false });

    const removed = toggleTagSelection(added.value, HEALTH);
    expect(removed).toEqual({ value: [], limitReached: false });
  });

  it('allows any combination of tags', () => {
    const result = toggleTagSelection(['health'], MOTHER);
    expect(result.value).toEqual(['health', 'mother']);
  });

  it('refuses to exceed the max number of tags', () => {
    const fullSelection = Array.from({ length: MAX_SELECTED_TAGS }, (_, index) => `tag-${index}`);
    const result = toggleTagSelection(fullSelection, HEALTH);

    expect(result).toEqual({ value: fullSelection, limitReached: true });
  });
});

describe('mergeReadableTags', () => {
  it('prefers active tags over historical copies with the same id', () => {
    const oldHealth = { ...HEALTH, name: 'Old health', is_active: false };
    const merged = mergeReadableTags([HEALTH], [oldHealth, DELIVERY]);

    expect(merged.find(tag => tag.id === 'health')?.name).toBe('Health');
    expect(merged.map(tag => tag.id)).toContain('delivery');
  });
});

describe('hasTagNamed', () => {
  it('matches names ignoring case and surrounding spaces', () => {
    expect(hasTagNamed(ALL_TAGS, ' health ')).toBe(true);
    expect(hasTagNamed(ALL_TAGS, 'Heal')).toBe(false);
  });
});
