import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-sm text-faint">{hint}</p> : null}
    </Card>
  );
}
