import { ChevronDown } from 'lucide-react';
import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Select({ label, error, hint, className, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <span className="relative block">
        <select
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3 pr-10 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-surface-muted',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-faint"
          aria-hidden="true"
        />
      </span>
      {error ? (
        <span id={messageId} className="text-xs text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={messageId} className="text-xs text-faint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
