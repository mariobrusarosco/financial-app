import { cn } from '@/domains/ui-system/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
  className,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav className={cn('flex gap-2', className)} aria-label="Pagination">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="group grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <div key={`dots-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'group grid h-8 w-8 place-items-center rounded-lg bg-muted text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-brand',
                page === currentPage &&
                  'bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground'
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="group grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};
