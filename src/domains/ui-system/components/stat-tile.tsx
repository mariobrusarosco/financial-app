import type * as React from 'react';
import { Skeleton } from '@/domains/ui-system/components/skeleton';
import { cn } from '@/domains/ui-system/utils';

interface StatTileProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Secondary line under the value, e.g. a comparison or count */
  hint?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

/** Filled KPI tile: muted label on top, large figure below. */
export const StatTile = ({
  label,
  value,
  hint,
  icon: Icon,
  isLoading = false,
  className,
  ...props
}: StatTileProps) => (
  <div
    data-slot="stat-tile"
    className={cn(
      'flex min-h-32 flex-col justify-between gap-4 rounded-2xl bg-muted p-5',
      className
    )}
    {...props}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm leading-snug text-muted-foreground">{label}</p>
      {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </div>

    <div>
      {isLoading ? (
        <Skeleton className="h-9 w-32 bg-border" />
      ) : (
        <div className="financial-value text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
      )}
      {hint && !isLoading && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  </div>
);
