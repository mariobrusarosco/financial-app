import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';
import { Plus } from 'lucide-react';
import type * as React from 'react';

interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onAdd?: () => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
  iconColor?: string;
}

export const PageHeader = ({
  title,
  icon: Icon,
  onAdd,
  addButtonLabel = 'Add',
  showAddButton = true,
  iconColor = 'bg-pastel-blue text-brand',
}: PageHeaderProps) => {
  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-ui="page-header"
    >
      <div className="flex items-center gap-3">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', iconColor)}>
          <Icon className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>

      {showAddButton && onAdd && (
        <div className="flex items-center gap-2 text-primary">
          <Button
            data-testid={`${title.toLowerCase()}-add-button`}
            variant="default"
            onClick={() => void onAdd()}
          >
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
