import { format, isValid, parseISO, startOfDay } from 'date-fns';
import type { I_CreditCardInvoice } from '@/domains/credit-cards/types/types-and-interfaces';

export type T_InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

const ISO_DATE_PATTERN = /\d{4}-\d{2}-\d{2}/g;
const FULL_DATE_FORMAT = 'MMM d, yyyy';

const parseDate = (value: string | undefined) => {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
};

export const formatInvoiceDate = (value: string | undefined) => {
  const date = parseDate(value);
  return date ? format(date, FULL_DATE_FORMAT) : (value ?? '');
};

/**
 * Turns a raw period such as "2026-02-27 a 2026-03-30" into "Feb 27 – Mar 30, 2026".
 * Falls back to the raw string when it doesn't contain two ISO dates.
 */
export const formatInvoicePeriod = (period: string | undefined) => {
  const [start, end] = (period?.match(ISO_DATE_PATTERN) ?? []).map(parseDate);
  if (!start || !end) return period ?? '';

  const sameYear = start.getFullYear() === end.getFullYear();
  return `${format(start, sameYear ? 'MMM d' : FULL_DATE_FORMAT)} – ${format(end, FULL_DATE_FORMAT)}`;
};

export const getInvoiceStatus = (invoice: I_CreditCardInvoice): T_InvoiceStatus => {
  if (invoice.is_paid) return 'paid';

  const dueDate = parseDate(invoice.raw_invoice.due_date);
  if (dueDate && dueDate < startOfDay(new Date())) return 'overdue';

  return 'unpaid';
};

export const sortInvoicesByDueDate = (invoices: I_CreditCardInvoice[]) =>
  [...invoices].sort((a, b) => {
    const aTime = parseDate(a.raw_invoice.due_date)?.getTime() ?? 0;
    const bTime = parseDate(b.raw_invoice.due_date)?.getTime() ?? 0;
    return bTime - aTime;
  });
