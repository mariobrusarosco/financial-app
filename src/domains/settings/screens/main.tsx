import { User } from 'lucide-react';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { PageHeader } from '@/domains/global/components';
import { ProfileCard } from '../components/profile-card';
import { AccountActionsCard } from '../components/account-actions-card';
import { PreferencesCard } from '../components/preferences-card';

export const SettingsMainScreen = () => {
  const { user } = useAuth();

  return (
    <div className="py-4 space-y-5 rounded-3xl">
      <PageHeader title="Settings" icon={User} showAddButton={false} />

      <div className="space-y-6">
        <ProfileCard user={user} />
        <AccountActionsCard />
        <PreferencesCard />
      </div>
    </div>
  );
};
