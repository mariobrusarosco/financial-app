import * as React from 'react';
import { cn } from '@/domains/ui-system/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Surface variant
   */
  variant?: 'default' | 'muted' | 'elevated';
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the surface should have hover effects
   */
  hoverable?: boolean;
  /**
   * Whether the surface should be clickable (adds cursor pointer)
   */
  clickable?: boolean;
  /**
   * Child content
   */
  children?: React.ReactNode;
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      hoverable = false,
      clickable = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground shadow-[var(--shadow-panel)] transition-[background-color,border-color,box-shadow,transform]',

          // Variant styles
          {
            'bg-card': variant === 'default',
            'bg-muted/60': variant === 'muted',
            'bg-card shadow-lg shadow-primary/5': variant === 'elevated',
          },

          // Size styles
          {
            'p-3': size === 'sm',
            'p-4': size === 'md',
            'p-6': size === 'lg',
          },

          // Interactive styles
          {
            'hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lg hover:shadow-primary/8':
              hoverable,
            'cursor-pointer': clickable,
            'focus-visible:ring-2 focus-visible:ring-ring': clickable,
          },

          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = 'Surface';

export { Surface };
