import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Tooltip({
  content,
  children,
  side = 'right',
}: {
  content: string;
  children: ReactNode;
  side?: 'right' | 'bottom';
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-40 hidden whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-medium text-canvas opacity-0 shadow-pop transition group-hover:opacity-100 group-focus-within:opacity-100 md:block',
          side === 'right' ? 'top-1/2 left-full ml-2 -translate-y-1/2' : 'top-full left-1/2 mt-2 -translate-x-1/2',
        )}
      >
        {content}
      </span>
    </span>
  );
}
