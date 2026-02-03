import { User } from 'lucide-react';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { PageHeader } from '@/domains/global/components';
import { ProfileCard } from '@/domains/settings/components/profile-card';
import { AccountActionsCard } from '@/domains/settings/components/account-actions-card';
import { PreferencesCard } from '@/domains/settings/components/preferences-card';
import { VendorsCard } from '@/domains/settings/components/vendors-card';
import { DataTransferCard } from '@/domains/settings/components/data-transfer-card';

export const SettingsMainScreen = () => {
  const { user } = useAuth();

  return (
    <div className="py-4 space-y-5 rounded-3xl">
      <PageHeader title="Settings" icon={User} showAddButton={false} />

      <section className="bg-section-background rounded-3xl p-4">
        <VendorsCard />
      </section>

      <div className="space-y-6">
        <ProfileCard user={user} />
        <DataTransferCard />
        <AccountActionsCard />
        <PreferencesCard />
      </div>
    </div>
  );
};
