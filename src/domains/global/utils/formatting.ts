import { format, parseISO } from 'date-fns';

// ---------------------------
// Date Formatting
// ---------------------------

/**
 * Formats a date to "MMM d" (e.g., "Jan 1")
 * Handles string strings or Date objects.
 */
export const formatDateShort = (dateString: string | Date): string => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d');
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Formats a date to "EEE, MMM d, yyyy" (e.g., "Mon, Jan 1, 2024")
 * Handles string strings or Date objects.
 */
export const formatDateLong = (dateString: string | Date): string => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'EEE, MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Formats a date to "MMM d, yyyy" (e.g., "Jan 1, 2024")
 * Handles string strings or Date objects.
 */
export const formatDateMedium = (dateString: string | Date): string => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

// ---------------------------
// Currency Formatting
// ---------------------------

/**
 * Parses a string amount that might be in Brazilian format (1.234,56) or US format (1,234.56)
 * and returns a number.
 */
export const parseCurrencyAmount = (amount: string | number): number => {
  if (typeof amount === 'number') return amount;
  if (!amount) return 0;

  try {
    // Handle Brazilian format (e.g., "5.861,36" or "+ 5.861,36" or "- 1.772,93")
    let cleanAmount = amount.trim();

    // Remove currency symbols (e.g. $, R$, etc) and other non-numeric chars except , . + -
    // Note: We keep leading + or - for now to detect sign, but we might want to strip them after.
    // Actually, the previous regex was stripping them.

    // Remove currency symbols like "R$", "$", etc. and trim again
    cleanAmount = cleanAmount.replace(/^[^\d\.,+-]+/, '').trim();

    // Remove leading + or - signs for parsing
    const isNegative = cleanAmount.startsWith('-');
    cleanAmount = cleanAmount.replace(/^[+-]\s*/, '');

    // Check if it's Brazilian format (contains comma as decimal separator and possibly dots as thousands)
    // Heuristic: Last comma index > Last dot index implies comma is decimal separator
    if (
      cleanAmount.includes(',') &&
      cleanAmount.lastIndexOf(',') > cleanAmount.lastIndexOf('.')
    ) {
      // Brazilian format: "5.861,36" -> "5861.36"
      cleanAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
    }

    // If it's standard format (1,234.56), remove commas
    if (cleanAmount.includes(',')) {
      cleanAmount = cleanAmount.replace(/,/g, '');
    }

    let numAmount = parseFloat(cleanAmount);

    // Apply original sign if it was negative
    if (isNegative) {
      numAmount = -numAmount;
    }

    return isNaN(numAmount) ? 0 : numAmount;
  } catch (error) {
    return 0;
  }
};

/**
 * Formats a number or string amount to a currency string (e.g., "$1,234.56")
 */
export const formatCurrencyAmount = (
  amount: string | number,
  options: {
    showSign?: boolean;
    currency?: string;
    locale?: string;
  } = {}
) => {
  const { showSign = false, currency = 'USD', locale = 'en-US' } = options;

  if (amount === undefined || amount === null) {
    // Return formatted zero with correct currency/locale
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(0);
    } catch {
      return '$0.00';
    }
  }

  const numAmount = parseCurrencyAmount(amount);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(showSign ? Math.abs(numAmount) : numAmount);
  } catch (error) {
    return '$0.00';
  }
};
