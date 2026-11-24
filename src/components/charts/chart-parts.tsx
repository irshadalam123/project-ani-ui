import type { ReactElement } from 'react';
import { ResponsiveContainer, type TooltipContentProps } from 'recharts';
import { useChartTheme } from '@/components/charts/useChartTheme';
import { EmptyState } from '@/components/ui/EmptyState';

export interface ChartPoint {
  label: string;
  value: number;
  secondary?: number;
}

export function ChartShell({
  data,
  emptyTitle,
  emptyDescription,
  children,
}: {
  data: ChartPoint[];
  emptyTitle: string;
  emptyDescription: string;
  children: ReactElement;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  const theme = useChartTheme();
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-pop"
      style={{ background: theme.surface, borderColor: theme.line }}
    >
      <p className="font-semibold text-ink">{label}</p>
      {payload.map((item) => (
        <p key={String(item.dataKey)} style={{ color: theme.text }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}
