import type { ReactNode } from 'react';

export function WorkflowStep({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative pl-8">
      <span className="absolute top-0 left-0 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
        {label}
      </span>
      <div className="absolute top-6 bottom-0 left-[7px] w-px bg-line" aria-hidden="true" />
      <span className="absolute top-6 left-[3px] size-2.5 rounded-full border-2 border-brand bg-surface" aria-hidden="true" />
      <div className="pt-6">{children}</div>
    </div>
  );
}
