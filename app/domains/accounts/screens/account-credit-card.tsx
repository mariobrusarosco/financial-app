import { CreditCardStatementUpload } from '@/domains/credit-cards/components/credit-card-statement-upload';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { FileText } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { Upload } from 'lucide-react';
import { useCreditCard } from '@/domains/credit-cards/hooks/use-credit-card';

interface AccountCreditCardScreenProps {
  params: {
    slug: string;
    creditCardId: string;
  };
}

export const AccountCreditCardScreen = ({ params }: AccountCreditCardScreenProps) => {
  const { slug, creditCardId } = params;
  console.log({ creditCardId });
  const creditCard = useCreditCard(creditCardId);

  if (creditCard.isLoading) {
    return <div>Loading...</div>;
  }

  if (creditCard.error) {
    return <div>Error: {creditCard.error.message}</div>;
  }

  console.log(creditCard.data);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex items-center gap-4">
          <h1 className="text-2xl font-bold">Credit Card</h1>
          <h2 className="text-lg text-rose-500 font-semibold">{creditCard.data?.name}</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Previously uploaded invoice for this credit card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first invoice to start tracking your account history
            </p>
            <Button onClick={() => {}} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreditCardStatementUpload creditCardId={creditCardId} />
    </div>
  );
};
