import { X } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/domains/ui-system/components/button';
import {
  DrawerClose,
  DrawerDescription,
  DrawerTitle,
} from '@/domains/ui-system/components/drawer';
import { cn } from '@/domains/ui-system/utils';

/*
 * Shared structure for every GlobalDrawer screen:
 *
 *   <DrawerLayout>
 *     <DrawerLayoutHeader icon={…} title="…" description="…" />
 *     <DrawerLayoutBody aside={optional side column}>…form…</DrawerLayoutBody>
 *     <DrawerLayoutFooter hint={optional}>…actions…</DrawerLayoutFooter>
 *   </DrawerLayout>
 *
 * Only the body scrolls; header and footer stay put. Closing goes through DrawerClose by
 * default, so GlobalDrawer's own close handler cleans up the URL.
 */

export const DrawerLayout = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="drawer-layout"
    className={cn('flex min-h-0 flex-1 flex-col', className)}
    {...props}
  />
);

interface DrawerLayoutHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  /** A string renders as the drawer title; any other node must include its own DrawerTitle */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Extra controls placed before the close button */
  actions?: React.ReactNode;
  /** Overrides the default close (DrawerClose) */
  onClose?: () => void;
  className?: string;
}

export const DrawerLayoutHeader = ({
  icon: Icon,
  title,
  description,
  actions,
  onClose,
  className,
}: DrawerLayoutHeaderProps) => {
  const closeButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Close"
      onClick={onClose}
      className="h-9 w-9 shrink-0 text-muted-foreground"
    >
      <X className="h-5 w-5" />
    </Button>
  );

  return (
    <header
      data-slot="drawer-layout-header"
      className={cn(
        'flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-8 md:py-5',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pastel-blue text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          {typeof title === 'string' ? (
            <DrawerTitle className="truncate text-lg font-semibold text-foreground">
              {title}
            </DrawerTitle>
          ) : (
            title
          )}
          {description && (
            <DrawerDescription className="truncate text-xs text-muted-foreground">
              {description}
            </DrawerDescription>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {onClose ? closeButton : <DrawerClose asChild>{closeButton}</DrawerClose>}
      </div>
    </header>
  );
};

interface DrawerLayoutBodyProps extends React.ComponentProps<'div'> {
  /** Side column (summaries, previews, pending lists): right of the body on desktop, below it on mobile */
  aside?: React.ReactNode;
}

export const DrawerLayoutBody = ({ aside, className, children, ...props }: DrawerLayoutBodyProps) => {
  const content = (
    <div
      data-slot="drawer-layout-body"
      className={cn('px-5 py-6 md:px-8', aside ? 'md:overflow-y-auto' : 'min-h-0 flex-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  );

  if (!aside) return content;

  return (
    <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden">
      {content}
      {aside}
    </div>
  );
};

/** Styled container for DrawerLayoutBody's `aside` */
export const DrawerLayoutAside = ({ className, ...props }: React.ComponentProps<'aside'>) => (
  <aside
    className={cn(
      'flex min-h-0 flex-col gap-4 border-t border-border bg-sidebar p-5 md:overflow-y-auto md:border-t-0 md:border-l md:p-6',
      className
    )}
    {...props}
  />
);

interface DrawerLayoutFooterProps {
  /** Small helper text on the left (hidden on mobile), e.g. keyboard shortcuts */
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DrawerLayoutFooter = ({ hint, children, className }: DrawerLayoutFooterProps) => (
  <footer
    data-slot="drawer-layout-footer"
    className={cn(
      'flex shrink-0 flex-col gap-3 border-t border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8',
      className
    )}
  >
    <div className="hidden text-xs text-muted-foreground sm:block">{hint}</div>
    <div className="flex gap-2 sm:justify-end [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>
  </footer>
);

/** Secondary footer action that closes the drawer without saving */
export const DrawerLayoutCancel = ({ children = 'Cancel' }: { children?: React.ReactNode }) => (
  <DrawerClose asChild>
    <Button type="button" variant="ghost">
      {children}
    </Button>
  </DrawerClose>
);
