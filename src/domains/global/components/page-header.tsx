import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import type * as React from 'react';

interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onAdd?: () => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
}

export const PageHeader = ({
  title,
  icon: Icon,
  onAdd,
  addButtonLabel = 'Add',
  showAddButton = true,
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="p-3 bg-foreground/20 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </span>
        <h1 className="text-4xl text-primary font-light tracking-tight">{title}</h1>
      </div>

      {showAddButton && onAdd && (
        <div className="flex items-center gap-2">
          <span className="">{addButtonLabel}</span>
          <Button className="rounded-full w-10 h-10" variant="default" onClick={() => void onAdd()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
