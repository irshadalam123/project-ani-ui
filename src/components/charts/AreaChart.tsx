import { Area, AreaChart as ReAreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartShell, ChartTooltip, type ChartPoint } from '@/components/charts/chart-parts';
import { useChartTheme } from '@/components/charts/useChartTheme';

export function AreaChartCard({
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
      <ReAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="value" name="Count" stroke={theme.primary} fill={theme.primary} fillOpacity={0.16} />
      </ReAreaChart>
    </ChartShell>
  );
}
