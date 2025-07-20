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
          // Base styles - similar to the rounded cards in the screenshot
          'rounded-2xl border bg-card text-card-foreground shadow-sm transition-colors',

          // Variant styles
          {
            'bg-background border-border': variant === 'default',
            'bg-muted/50 border-muted': variant === 'muted',
            'bg-card border-border shadow-md': variant === 'elevated',
          },

          // Size styles
          {
            'p-3': size === 'sm',
            'p-4': size === 'md',
            'p-6': size === 'lg',
          },

          // Interactive styles
          {
            'hover:bg-accent/50 hover:border-accent': hoverable,
            'cursor-pointer': clickable,
            'hover:shadow-md': hoverable || clickable,
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
