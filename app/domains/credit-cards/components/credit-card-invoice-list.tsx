import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Download, FileText, Text, Upload } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { useCreditCardInvoices } from '@/domains/credit-cards/hooks/user-credit-card-invoices';

interface CreditCardInvoiceListProps {
  creditCardId: string;
}

const CreditCardInvoiceList = ({ creditCardId }: CreditCardInvoiceListProps) => {
  const { data: invoices, isLoading, isError } = useCreditCardInvoices(creditCardId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>Previously uploaded invoice for this credit card</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices && invoices.length > 0 ? (
          <div className="text-center py-8">
            {invoices.map(invoice => (
              <div key={invoice} className="flex items-center gap-2">
                <Text className="h-4 w-4" />
                <p className="text-sm text-primary">{invoice}</p>
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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
      </CardContent>
    </Card>
  );
};

export { CreditCardInvoiceList };
