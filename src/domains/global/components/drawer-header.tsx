import {
  DrawerTitle,
  DrawerDescription,
} from '@/domains/ui-system/components/drawer';
import type * as React from 'react';

interface DrawerHeaderProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const DrawerHeader = ({
  title,
  icon: Icon,
  description,
}: DrawerHeaderProps) => {
  return (
    <div className="flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="p-2 bg-foreground/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </span>
        )}
        <DrawerTitle>{title}</DrawerTitle>
      </div>
      {description && <DrawerDescription>{description}</DrawerDescription>}
    </div>
  );
};
