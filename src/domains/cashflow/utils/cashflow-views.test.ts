import { describe, expect, it } from 'vitest';
import type { I_CashflowViewResponse } from '@/domains/cashflow/types/index';
import { findViewGroupsUsingTag, resolveSelectedViewId } from './cashflow-views';

const buildView = (overrides: Partial<I_CashflowViewResponse>): I_CashflowViewResponse => ({
  id: 'view',
  name: 'View',
  display_order: 0,
  groups: [],
  created_at: '',
  updated_at: '',
  ...overrides,
});

const BY_KIND = buildView({
  id: 'by-kind',
  name: 'By kind',
  groups: [
    { id: 'g-rent', name: 'Rent', tag_ids: ['t-family', 't-personal'] },
    { id: 'g-food', name: 'Food', tag_ids: ['t-food'] },
  ],
});
const BY_PERSON = buildView({
  id: 'by-person',
  name: 'By person',
  groups: [{ id: 'g-family', name: 'Family', tag_ids: ['t-rent', 't-food'] }],
});
const VIEWS = [BY_KIND, BY_PERSON];

describe('resolveSelectedViewId', () => {
  it('reopens the last used view when it still exists', () => {
    expect(resolveSelectedViewId(VIEWS, 'by-person')).toBe('by-person');
  });

  it('falls back to the first view', () => {
    expect(resolveSelectedViewId(VIEWS, 'deleted-view')).toBe('by-kind');
    expect(resolveSelectedViewId(VIEWS, null)).toBe('by-kind');
  });

  it('returns nothing when there are no views', () => {
    expect(resolveSelectedViewId([], 'by-kind')).toBeUndefined();
  });
});

describe('findViewGroupsUsingTag', () => {
  it('lists every view group containing the tag', () => {
    expect(findViewGroupsUsingTag(VIEWS, 't-food')).toEqual([
      { viewName: 'By kind', groupName: 'Food' },
      { viewName: 'By person', groupName: 'Family' },
    ]);
  });

  it('returns an empty list when no group uses the tag', () => {
    expect(findViewGroupsUsingTag(VIEWS, 't-unused')).toEqual([]);
  });
});
