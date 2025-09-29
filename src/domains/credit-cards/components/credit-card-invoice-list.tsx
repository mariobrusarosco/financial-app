import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Download, FileText, Text, Upload, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { Badge } from '@/domains/ui-system/components/badge';
import { Currency } from '@/domains/ui-system/components/currency';
import { useCreditCardInvoices } from '@/domains/credit-cards/hooks/user-credit-card-invoices';
import { Surface } from '@/domains/global/components/surface';
import type { I_CreditCardInvoice } from '@/domains/credit-cards/types/types-and-interfaces';

interface CreditCardInvoiceListProps {
  creditCardId: string;
}

const CreditCardInvoiceList = ({ creditCardId }: CreditCardInvoiceListProps) => {
  const { data: invoices, isLoading, isError } = useCreditCardInvoices(creditCardId);

  if (isLoading) {
    return (
      <Surface data-ui="credit-card-invoice-list" className="w-full flex-1">
        <div>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Previously uploaded invoices for this credit card</CardDescription>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
      </Surface>
    );
  }

  if (isError) {
    return (
      <Surface data-ui="credit-card-invoice-list" className="w-full flex-1">
        <div>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Previously uploaded invoices for this credit card</CardDescription>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load invoices</p>
        </div>
      </Surface>
    );
  }

  return (
    <Surface data-ui="credit-card-invoice-list" className="w-full flex-1">
      <div>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>Previously uploaded invoices for this credit card</CardDescription>
      </div>

      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices && invoices.length > 0 ? (
          <>
            {invoices.map((invoice: I_CreditCardInvoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{invoice.raw_invoice.period}</span>
                      <span className="text-xs text-muted-foreground">
                        Due: {invoice.raw_invoice.due_date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={invoice.is_paid ? 'secondary' : 'destructive'}>
                      {invoice.is_paid ? 'Paid' : 'Unpaid'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Due:</span>
                    <Currency
                      value={parseFloat(invoice.raw_invoice.total_due)}
                      color="negative"
                      variant="compact"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Min Payment:</span>
                    <Currency
                      value={parseFloat(invoice.raw_invoice.min_payment)}
                      variant="compact"
                    />
                  </div>
                </div>

                {invoice.raw_invoice.transactions &&
                  invoice.raw_invoice.transactions.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        {invoice.raw_invoice.transactions.length} transactions
                      </span>
                    </div>
                  )}
              </div>
            ))}

            {invoices.length >= 5 && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">
                  Showing recent {invoices.length} invoices
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first invoice to start tracking your account history
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Invoice
            </Button>
          </div>
        )}
      </div>
    </Surface>
  );
};

export { CreditCardInvoiceList };
