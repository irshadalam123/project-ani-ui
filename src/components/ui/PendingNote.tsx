import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-muted px-3 py-2 text-xs leading-5 text-muted">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
