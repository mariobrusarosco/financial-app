import { describe, expect, it } from 'vitest';
import type {
  I_CashflowViewGroupResponse,
  I_CashflowViewResponse,
} from '@/domains/cashflow/types/index';
import {
  findViewGroupsUsingTag,
  indexSummaryTotals,
  listViewGroups,
  resolveSelectedViewId,
} from './cashflow-views';

const buildView = (overrides: Partial<I_CashflowViewResponse>): I_CashflowViewResponse => ({
  id: 'view',
  name: 'View',
  display_order: 0,
  groups: [],
  created_at: '',
  updated_at: '',
  ...overrides,
});

const tagGroup = (id: string, name: string, tagIds: string[]): I_CashflowViewGroupResponse => ({
  id,
  name,
  match: 'any',
  tag_ids: tagIds,
  groups: [],
});

const parentGroup = (
  id: string,
  name: string,
  subGroups: I_CashflowViewGroupResponse[]
): I_CashflowViewGroupResponse => ({ id, name, match: null, tag_ids: [], groups: subGroups });

const BY_KIND = buildView({
  id: 'by-kind',
  name: 'By kind',
  groups: [
    tagGroup('g-rent', 'Rent', ['t-family', 't-personal']),
    tagGroup('g-food', 'Food', ['t-food']),
  ],
});
const BY_PERSON = buildView({
  id: 'by-person',
  name: 'By person',
  groups: [tagGroup('g-family', 'Family', ['t-rent', 't-food'])],
});
const MAINTENANCE_ID = 'g-maintenance';
const MONTHLY = buildView({
  id: 'monthly',
  name: 'Monthly',
  groups: [
    parentGroup('g-home', 'Home', [
      tagGroup('g-bills', 'Bills', ['t-rent', 't-water']),
      tagGroup(MAINTENANCE_ID, 'Maintenance', ['t-plumber']),
    ]),
  ],
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

  it('names a sub-group by its path', () => {
    expect(findViewGroupsUsingTag([MONTHLY], 't-water')).toEqual([
      { viewName: 'Monthly', groupName: 'Home › Bills' },
    ]);
  });
});

describe('listViewGroups', () => {
  it('lists parents before their sub-groups, each with its path', () => {
    expect(listViewGroups(MONTHLY.groups).map(({ group, path }) => [group.id, path])).toEqual([
      ['g-home', 'Home'],
      ['g-bills', 'Home › Bills'],
      [MAINTENANCE_ID, 'Home › Maintenance'],
    ]);
  });
});

describe('indexSummaryTotals', () => {
  it('indexes parents and sub-groups by id, as numbers', () => {
    const totals = indexSummaryTotals([
      {
        group_id: 'g-home',
        total: '5200.00',
        count: 9,
        groups: [
          { group_id: 'g-bills', total: '4300.00', count: 3, groups: [] },
          { group_id: MAINTENANCE_ID, total: '900.00', count: 6, groups: [] },
        ],
      },
    ]);

    expect(totals.get('g-home')).toEqual({ total: 5200, count: 9 });
    expect(totals.get(MAINTENANCE_ID)).toEqual({ total: 900, count: 6 });
    expect(totals.size).toBe(3);
  });
});
