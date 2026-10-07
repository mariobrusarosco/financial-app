import * as React from 'react';

import { cn } from '@/domains/ui-system/utils/index';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 py-2 text-base text-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground selection:bg-brand selection:text-brand-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
