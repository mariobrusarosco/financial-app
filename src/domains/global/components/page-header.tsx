import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';
import { Plus } from 'lucide-react';
import type * as React from 'react';

interface PageHeaderProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  /** Extra controls rendered before the add button, e.g. period filters */
  actions?: React.ReactNode;
  onAdd?: () => void;
  addButtonLabel?: string;
  showAddButton?: boolean;
  iconColor?: string;
}

export const PageHeader = ({
  title,
  icon: Icon,
  description,
  actions,
  onAdd,
  addButtonLabel = 'Add',
  showAddButton = true,
  iconColor = 'bg-pastel-blue text-brand',
}: PageHeaderProps) => {
  const showAdd = showAddButton && onAdd;

  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-ui="page-header"
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', iconColor)}>
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      {(actions || showAdd) && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {showAdd && (
            <Button
              data-testid={`${title.toLowerCase()}-add-button`}
              variant="default"
              onClick={() => void onAdd()}
            >
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
