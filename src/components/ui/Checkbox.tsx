import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('inline-flex items-center gap-2 text-sm text-ink', className)}>
      <input
        type="checkbox"
        className="size-4 rounded border-line text-brand accent-brand focus-visible:outline-brand"
        {...props}
      />
      {label}
    </label>
  );
}
