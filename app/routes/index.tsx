import { Button } from '@/domains/ui-system/components/button';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-red-500">
      Hello "/"!
      <Button asChild>
        <Link to="/accounts">Accounts</Link>
      </Button>
      <Button asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
      <Button asChild>
        <Link to="/brokers">Brokers</Link>
      </Button>
    </div>
  );
}
