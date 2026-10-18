import { CalendarClock, FileText, Receipt } from 'lucide-react';
import { Currency } from '@/domains/ui-system/components/currency';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { Surface } from '@/domains/global/components/surface';
import { useCreditCardInvoices } from '@/domains/credit-cards/hooks/user-credit-card-invoices';
import type { I_CreditCardInvoice } from '@/domains/credit-cards/types/types-and-interfaces';
import {
  formatInvoiceDate,
  formatInvoicePeriod,
  getInvoiceStatus,
  sortInvoicesByDueDate,
  type T_InvoiceStatus,
} from '@/domains/credit-cards/utils/invoice-utils';
import { cn } from '@/domains/ui-system/utils';

interface CreditCardInvoiceListProps {
  creditCardId: string;
  currency?: string;
}

const STATUS_STYLES: Record<T_InvoiceStatus, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-positive/10 text-positive' },
  unpaid: { label: 'Open', className: 'bg-muted text-muted-foreground' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive' },
};

const CreditCardInvoiceList = ({ creditCardId, currency }: CreditCardInvoiceListProps) => {
  const { data: invoices, isLoading, isError } = useCreditCardInvoices(creditCardId);
  const sortedInvoices = invoices ? sortInvoicesByDueDate(invoices) : [];

  return (
    <Surface size="lg" className="flex flex-col gap-5" data-ui="credit-card-invoice-list">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Invoice history</h2>
          <p className="text-sm text-muted-foreground">Invoices uploaded for this card</p>
        </div>
        {sortedInvoices.length > 0 && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {sortedInvoices.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          We couldn&apos;t load the invoices for this card.
        </div>
      ) : sortedInvoices.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <FileText className="mb-3 h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No invoices yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a PDF invoice to start tracking this card.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedInvoices.map(invoice => (
            <InvoiceItem key={invoice.id} invoice={invoice} currency={currency} />
          ))}
        </ul>
      )}
    </Surface>
  );
};

const InvoiceItem = ({
  invoice,
  currency,
}: {
  invoice: I_CreditCardInvoice;
  currency?: string;
}) => {
  const status = STATUS_STYLES[getInvoiceStatus(invoice)];
  const transactionsCount = invoice.raw_invoice.transactions?.length ?? 0;

  return (
    <li className="rounded-xl border border-border/80 p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {formatInvoicePeriod(invoice.raw_invoice.period)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3 w-3" />
            Due {formatInvoiceDate(invoice.raw_invoice.due_date)}
          </p>
        </div>
        <span
          className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', status.className)}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Total due</p>
          <Currency
            value={invoice.raw_invoice.total_due}
            currency={currency}
            color="default"
            className="financial-value text-lg text-foreground"
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Minimum</p>
          <Currency
            value={invoice.raw_invoice.min_payment}
            currency={currency}
            variant="small"
            color="muted"
          />
        </div>
      </div>

      {transactionsCount > 0 && (
        <p className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <Receipt className="h-3 w-3" />
          {transactionsCount} {transactionsCount === 1 ? 'transaction' : 'transactions'}
        </p>
      )}
    </li>
  );
};

export { CreditCardInvoiceList };
