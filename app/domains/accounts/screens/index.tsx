import AccountsList from '../components/accounts-list';
import { Link } from '@tanstack/react-router';

export const AccountIndexScreen = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Accounts</h1>
        <Link to="/accounts/create">Create Account</Link>
      </div>
      <AccountsList />
    </div>
  );
};
