import { createFileRoute, Link } from '@tanstack/react-router';
import AccountsList from '@/domains/accounts/components/accounts-list';

export const Route = createFileRoute('/(auth)/accounts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/(auth)/accounts/"!
      <AccountsList />
      <Link to="/accounts/create">Create Account</Link>
    </div>
  );
}
