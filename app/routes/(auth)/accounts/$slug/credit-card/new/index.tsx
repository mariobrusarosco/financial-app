import { createFileRoute } from '@tanstack/react-router';
import { CreateCreditCardForm } from '@/domains/credit-cards/components/create-credit-card-form';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/new/')({
  component: CreateCreditCardRouteComponent,
});

function CreateCreditCardRouteComponent() {
  const { slug } = Route.useParams();

  return (
    <div className="container mx-auto py-8">
      <CreateCreditCardForm accountId={slug} />
    </div>
  );
}
