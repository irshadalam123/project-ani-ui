import { useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(
          'min-h-24 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink shadow-sm transition placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30',
          error ? 'border-danger focus:border-danger focus:ring-danger/30' : '',
          className,
        )}
        {...props}
      />
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
