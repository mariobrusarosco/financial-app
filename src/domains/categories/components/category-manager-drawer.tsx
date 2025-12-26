import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/domains/ui-system/components/drawer';
import { CategoryManager } from './category-manager';

export const CategoryManagerDrawer = () => {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Manage Categories</DrawerTitle>
        <DrawerDescription>
          Create, edit, and organize your transaction categories
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4 pb-4 overflow-y-auto">
        <CategoryManager />
      </div>
    </>
  );
};
