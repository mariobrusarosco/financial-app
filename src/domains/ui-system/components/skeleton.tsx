import { cn } from '@/domains/ui-system/utils';
import type { HTMLAttributes } from 'react';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-lg bg-muted', className)} {...props} />;
}

export { Skeleton };
