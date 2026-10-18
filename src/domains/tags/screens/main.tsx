import { Tags } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';
import { TagsSettingsCard } from '@/domains/tags/components/tags-settings-card';

export const TagsMainScreen = () => {
  return (
    <div data-ui="tags-screen" className="space-y-7 pb-8">
      <PageHeader title="Tags" icon={Tags} showAddButton={false} />
      <TagsSettingsCard />
    </div>
  );
};
