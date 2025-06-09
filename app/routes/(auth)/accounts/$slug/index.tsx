import { Button } from '@/domains/ui-system/components/button';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/accounts/$slug/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  return (
    <div data-id="account-details">
      <h1>Hello "/(auth)/accounts/$slug/"! {slug}</h1>

      <Link to="/accounts/$slug/credit-card" params={{ slug }}>
        <Button>Credit Card</Button>
      </Link>
    </div>
  );
}
