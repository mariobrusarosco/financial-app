import { User } from 'lucide-react';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { PageHeader } from '@/domains/global/components';
import { ProfileCard } from '@/domains/settings/components/profile-card';
import { AccountActionsCard } from '@/domains/settings/components/account-actions-card';
import { PreferencesCard } from '@/domains/settings/components/preferences-card';
import { VendorsCard } from '@/domains/settings/components/vendors-card';
import { TagsCard } from '@/domains/settings/components/tags-card';
import { DataTransferCard } from '@/domains/settings/components/data-transfer-card';

export const SettingsMainScreen = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-7 pb-8">
      <PageHeader title="Settings" icon={User} showAddButton={false} />

      <section className="grid gap-5 xl:grid-cols-2">
        <VendorsCard />
        <TagsCard />
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="space-y-5">
          <ProfileCard user={user ?? null} />
          <PreferencesCard />
          <AccountActionsCard />
        </div>
        <DataTransferCard />
      </div>
    </div>
  );
};
