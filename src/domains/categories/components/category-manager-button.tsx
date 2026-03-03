import { Link } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { Settings2 } from 'lucide-react';

export const CategoryManagerButton = () => {
  return (
    <div className="flex  flex-col items-center gap-2">
      <Link to="." search={prev => ({ ...prev, drawer: 'category-manager' })}>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Settings2 className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </Link>
    </div>
  );
};
