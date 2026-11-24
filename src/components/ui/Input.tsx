import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leading?: ReactNode;
}

export function Input({ label, error, hint, leading, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <span className="relative block">
        {leading ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint">
            {leading}
          </span>
        ) : null}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            'h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink shadow-sm transition placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-surface-muted',
            leading ? 'pl-10' : '',
            error ? 'border-danger focus:border-danger focus:ring-danger/30' : '',
            className,
          )}
          {...props}
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
