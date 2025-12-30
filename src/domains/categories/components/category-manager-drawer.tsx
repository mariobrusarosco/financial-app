import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { CategoryManager } from './category-manager';
import { List } from 'lucide-react';

export const CategoryManagerDrawer = () => {
  return (
    <>
      <DrawerHeader
        title="Manage Categories"
        description="Create, edit, and organize your transaction categories"
        icon={List}
      />
      <div className="px-4 pb-4 overflow-y-auto">
        <CategoryManager />
      </div>
    </>
  );
};
