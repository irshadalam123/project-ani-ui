import { appName } from '@/config';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" className="text-brand" />
      <path
        d="M8 12.1c0-1.5 1.2-2.6 2.6-2.6h6.8c1.4 0 2.6 1.1 2.6 2.6v3.8c0 1.4-1.2 2.6-2.6 2.6H14.6l-2.7 2.2v-2.2H10.6c-1.4 0-2.6-1.2-2.6-2.6v-3.8z"
        fill="white"
      />
      <circle cx="22.4" cy="21.6" r="3.1" fill="white" opacity="0.92" />
      <path d="M17.8 17.8 20.6 19.7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5 text-ink">
      <LogoMark className="shrink-0" />
      {collapsed ? null : (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold tracking-tight">{appName}</span>
          <span className="block text-[11px] font-medium text-faint">Comment to DM</span>
        </span>
      )}
    </span>
  );
}
