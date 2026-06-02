import { cn } from '@/domains/ui-system/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
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
    <nav className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="grid bg-neutral-grey/10 hover:bg-sea-blue group  w-7 h-7 place-items-center rounded-md transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-sea-blue group-hover:text-neutral-white transition-colors" />
      </button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <div key={`dots-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'grid bg-neutral-grey/10 hover:bg-sea-blue group w-7 h-7 place-items-center rounded-md transition-colors',
                page === currentPage && 'bg-sea-blue'
              )}
            >
              <span
                className={cn(
                  'text-sea-blue group-hover:text-neutral-white transition-colors',
                  page === currentPage && 'text-neutral-white'
                )}
              >
                {page}
              </span>
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="grid bg-neutral-grey/10 hover:bg-sea-blue group  w-7 h-7 place-items-center rounded-md transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-sea-blue text-sea-blue group-hover:text-neutral-white transition-colors" />
      </button>
    </nav>
  );
};
