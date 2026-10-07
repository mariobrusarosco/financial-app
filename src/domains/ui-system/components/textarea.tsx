import * as React from 'react';

import { cn } from '@/domains/ui-system/utils/index';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content flex min-h-24 w-full rounded-xl border border-input bg-card px-3.5 py-3 text-base text-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
