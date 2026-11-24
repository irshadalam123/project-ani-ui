import { Bar, BarChart as ReBarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartShell, ChartTooltip, type ChartPoint } from '@/components/charts/chart-parts';
import { useChartTheme } from '@/components/charts/useChartTheme';

export function BarChartCard({
  data,
  emptyTitle = 'No chart data',
  emptyDescription = 'Activity will appear here once the API returns it.',
}: {
  data: ChartPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const theme = useChartTheme();
  const showSecondary = data.some((point) => point.secondary !== undefined);

  return (
    <ChartShell data={data} emptyTitle={emptyTitle} emptyDescription={emptyDescription}>
      <ReBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<ChartTooltip />} />
        {showSecondary ? <Legend /> : null}
        <Bar dataKey="value" name="Count" fill={theme.primary} radius={[6, 6, 0, 0]} />
        {showSecondary ? <Bar dataKey="secondary" name="Matched" fill={theme.secondary} radius={[6, 6, 0, 0]} /> : null}
      </ReBarChart>
    </ChartShell>
  );
}
