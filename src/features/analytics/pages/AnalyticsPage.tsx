import { MessageCircle, Send, Target, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useGetAnalyticsOverviewQuery } from '@/api/analyticsApi';
import { useGetAutomationsQuery } from '@/api/automationApi';
import { useGetExecutionsQuery } from '@/api/executionApi';
import { AreaChartCard } from '@/components/charts/AreaChart';
import { LineChartCard } from '@/components/charts/LineChart';
import { StatCard } from '@/components/charts/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PendingNote } from '@/components/ui/PendingNote';
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { failureCount, privateDmCount } from '@/features/automations/metrics';
import { conversionRate, formatNumber, formatPercent } from '@/lib/format';
import { parseApiError } from '@/lib/errors';

export default function AnalyticsPage() {
  const overview = useGetAnalyticsOverviewQuery();
  const automations = useGetAutomationsQuery({ page: 1, page_size: 50 });
  const executions = useGetExecutionsQuery({ page: 1, page_size: 100 });
  const data = overview.data;

  const performance = useMemo(() => {
    return (automations.data?.items ?? []).map((automation) => {
      const runs = (executions.data?.items ?? []).filter((item) => item.automation_id === automation.id);
      const dms = privateDmCount(runs, automation.id);
      const comments = new Set(runs.map((item) => item.comment_id)).size;
      return {
        id: automation.id,
        name: automation.name,
        comments,
        dms,
        leads: 0,
        conversion: conversionRate(comments, dms),
        failures: failureCount(runs, automation.id),
      };
    });
  }, [automations.data?.items, executions.data?.items]);

  return (
    <div className="space-y-6">
      <PageHeader description="Lifetime automation activity for this workspace." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Date range"
          tabs={[
            { id: '7d', label: '7 days' },
            { id: '30d', label: '30 days' },
            { id: '90d', label: '90 days' },
          ]}
          value="30d"
          onChange={() => undefined}
        />
      </div>
      <PendingNote>
        The date selector is visible for the product layout. GET /api/v1/analytics/overview has no range parameter, so every range shows the same all-time totals. A time-series endpoint is typed and unused until the backend ships it.
      </PendingNote>
      {overview.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : overview.isError || !data ? (
        <Card>
          <ErrorState description={parseApiError(overview.error)} onRetry={() => void overview.refetch()} />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Comments" value={formatNumber(data.comments_received)} hint={`${formatNumber(data.comments_matched)} matched`} icon={<MessageCircle className="size-4" />} />
          <StatCard label="DMs" value={formatNumber(data.private_replies_sent)} hint={`${formatNumber(data.public_replies_sent)} public replies`} icon={<Send className="size-4" />} />
          <StatCard label="Leads" value={formatNumber(data.leads)} hint="As returned by the API" icon={<Users className="size-4" />} />
          <StatCard label="Conversion rate" value={formatPercent(conversionRate(data.comments_received, data.private_replies_sent))} hint="Private DMs / comments" icon={<Target className="size-4" />} />
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Comments over time" />
          <LineChartCard data={[]} emptyTitle="No daily comments" emptyDescription="Time series will appear when the analytics API returns daily buckets." />
        </Card>
        <Card>
          <CardHeader title="DMs over time" />
          <AreaChartCard data={[]} emptyTitle="No daily DMs" emptyDescription="Time series will appear when the analytics API returns daily buckets." />
        </Card>
        <Card>
          <CardHeader title="Leads over time" />
          <LineChartCard data={[]} emptyTitle="No daily leads" emptyDescription="Leads are currently a lifetime total, not a series." />
        </Card>
      </div>
      <Card>
        <CardHeader title="Automation performance" description="Counts come from the executions currently loaded." />
        {automations.isLoading || executions.isLoading ? (
          <TableSkeleton />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Automation</TH>
                <TH>Comments</TH>
                <TH>DMs</TH>
                <TH>Leads</TH>
                <TH>Conversion</TH>
              </TR>
            </THead>
            <TBody>
              {performance.map((row) => (
                <TR key={row.id}>
                  <TD className="font-medium">{row.name}</TD>
                  <TD>{row.comments}</TD>
                  <TD>{row.dms}</TD>
                  <TD>{row.leads}</TD>
                  <TD>{formatPercent(row.conversion)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
