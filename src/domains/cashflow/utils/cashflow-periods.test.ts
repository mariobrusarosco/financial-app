import { describe, expect, it } from 'vitest';
import {
  fillMonthlySeries,
  getPercentChange,
  getPreviousPeriod,
  getTrendPeriod,
  isMonthInPeriod,
} from './cashflow-periods';

describe('getPreviousPeriod', () => {
  it('compares a full month with the previous full month', () => {
    expect(getPreviousPeriod('2026-10-01', '2026-10-31')).toEqual({
      from: '2026-09-01',
      to: '2026-09-30',
      label: 'vs Sep',
    });
  });

  it('handles January by going back to December', () => {
    expect(getPreviousPeriod('2026-01-01', '2026-01-31')).toMatchObject({
      from: '2025-12-01',
      to: '2025-12-31',
      label: 'vs Dec',
    });
  });

  it('uses the same number of days right before any other range', () => {
    expect(getPreviousPeriod('2026-10-11', '2026-10-20')).toEqual({
      from: '2026-10-01',
      to: '2026-10-10',
      label: 'vs previous period',
    });
  });

  it('returns nothing without a valid range', () => {
    expect(getPreviousPeriod(undefined, '2026-10-31')).toBeUndefined();
  });
});

describe('getTrendPeriod', () => {
  it('covers the 6 months ending with the selected month', () => {
    expect(getTrendPeriod('2026-10-18')).toEqual({ from: '2026-05-01', to: '2026-10-31' });
  });
});

describe('fillMonthlySeries', () => {
  it('adds zero months the API skipped, in order', () => {
    const series = fillMonthlySeries(
      [{ month: '2026-09', income: 100, expenses: 40, savings: 60, investments: 0 }],
      { from: '2026-08-01', to: '2026-10-31' }
    );

    expect(series.map(month => [month.month, month.income])).toEqual([
      ['2026-08', 0],
      ['2026-09', 100],
      ['2026-10', 0],
    ]);
  });
});

describe('isMonthInPeriod', () => {
  it('matches months that overlap the selected range', () => {
    expect(isMonthInPeriod('2026-10', '2026-10-01', '2026-10-31')).toBe(true);
    expect(isMonthInPeriod('2026-09', '2026-09-15', '2026-10-15')).toBe(true);
    expect(isMonthInPeriod('2026-08', '2026-09-15', '2026-10-15')).toBe(false);
  });
});

describe('getPercentChange', () => {
  it('computes the change against the previous value', () => {
    expect(getPercentChange(110, 100)).toBeCloseTo(10);
    expect(getPercentChange(50, 100)).toBeCloseTo(-50);
  });

  it('returns nothing when the previous value is zero', () => {
    expect(getPercentChange(100, 0)).toBeUndefined();
  });
});
