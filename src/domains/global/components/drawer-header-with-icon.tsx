import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/domains/ui-system/components/drawer';
import type * as React from 'react';

interface DrawerHeaderWithIconProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const DrawerHeaderWithIcon = ({
  title,
  icon: Icon,
  description,
}: DrawerHeaderWithIconProps) => {
  return (
    <DrawerHeader>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="p-2 bg-foreground/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </span>
        )}
        <DrawerTitle>{title}</DrawerTitle>
      </div>
      {description && <DrawerDescription>{description}</DrawerDescription>}
    </DrawerHeader>
  );
};
