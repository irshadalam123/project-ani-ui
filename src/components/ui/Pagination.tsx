import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const pages = buildPages(page, pageCount);

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-xs text-muted">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((item, index) =>
            item === '…' ? (
              <span key={`gap-${index}`} className="px-2 text-sm text-faint">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === page ? 'secondary' : 'ghost'}
                size="sm"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ),
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

function buildPages(current: number, count: number): Array<number | '…'> {
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1);
  const pages: Array<number | '…'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(count - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < count - 1) pages.push('…');
  pages.push(count);
  return pages;
}
