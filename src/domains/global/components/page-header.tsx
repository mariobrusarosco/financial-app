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
  iconColor = 'bg-rose-700',
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon className={cn("text-neutral-white rounded-md p-2.5 h-10 w-10", iconColor)} />
        <h1 className="text-4xl text-primary font-light tracking-tight">{title}</h1>
      </div>

      {showAddButton && onAdd && (
        <div className="flex items-center gap-2">
          <span className="">{addButtonLabel}</span>
          <Button
            data-testid={`${title.toLowerCase()}-add-button`}
            className="rounded-md w-"
            variant="default"
            onClick={() => void onAdd()}
          >
            new account
          </Button>
        </div>
      )}
    </div>
  );
};
