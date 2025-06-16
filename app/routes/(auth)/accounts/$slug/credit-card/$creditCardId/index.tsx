import { createFileRoute } from '@tanstack/react-router';
import { CreditCardStatementUpload } from '@/domains/credit-cards/components/credit-card-statement-upload';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/$creditCardId/')({
  component: CreditCardDetailRouteComponent,
});

function CreditCardDetailRouteComponent() {
  const { slug, creditCardId } = Route.useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credit Card Details</h1>
          <p className="text-muted-foreground">
            Account: {slug} | Credit Card: {creditCardId}
          </p>
        </div>
      </div>

      <CreditCardStatementUpload creditCardId={creditCardId} />
    </div>
  );
}
