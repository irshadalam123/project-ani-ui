import type { ReactNode } from 'react';

export function PageHeader({
  description,
  action,
}: {
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : <span />}
      {action}
    </div>
  );
}
