import { CartesianGrid, Line, LineChart as ReLineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartShell, ChartTooltip, type ChartPoint } from '@/components/charts/chart-parts';
import { useChartTheme } from '@/components/charts/useChartTheme';

export function LineChartCard({
  data,
  emptyTitle = 'No trend yet',
  emptyDescription = 'Daily totals will appear when the analytics API returns a time series.',
}: {
  data: ChartPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const theme = useChartTheme();
  return (
    <ChartShell data={data} emptyTitle={emptyTitle} emptyDescription={emptyDescription}>
      <ReLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="value" name="Count" stroke={theme.primary} strokeWidth={2} dot={false} />
      </ReLineChart>
    </ChartShell>
  );
}
