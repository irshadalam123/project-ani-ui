export function Progress({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const safeMax = max <= 0 ? 1 : max;
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-surface-muted"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}
