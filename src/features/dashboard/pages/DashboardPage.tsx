import { MessageCircle, Send, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAnalyticsOverviewQuery } from '@/api/analyticsApi';
import { useGetAutomationsQuery } from '@/api/automationApi';
import { useGetExecutionsQuery } from '@/api/executionApi';
import { useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { BarChartCard } from '@/components/charts/BarChart';
import { StatCard } from '@/components/charts/StatCard';
import { AutomationMenu } from '@/features/automations/components/AutomationMenu';
import { privateDmCount, triggerLabel } from '@/features/automations/metrics';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/layout/PageHeader';
import { PendingNote } from '@/components/ui/PendingNote';
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { conversionRate, firstName, formatDate, formatNumber, formatPercent, greeting } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const overview = useGetAnalyticsOverviewQuery();
  const automations = useGetAutomationsQuery({ page: 1, page_size: 5 });
  const executions = useGetExecutionsQuery({ page: 1, page_size: 100 });
  const accounts = useGetInstagramAccountsQuery();

  const data = overview.data;
  const rate = data ? conversionRate(data.comments_received, data.private_replies_sent) : 0;
  const chartData = data
    ? [
        { label: 'Comments', value: data.comments_received, secondary: data.comments_matched },
        { label: 'Public', value: data.public_replies_sent },
        { label: 'DMs', value: data.private_replies_sent },
        { label: 'Leads', value: data.leads },
        { label: 'Failed', value: data.failed_messages },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-semibold tracking-tight text-ink">
          {greeting()}, {firstName(user?.full_name ?? 'there')}
        </p>
        <PageHeader description="Here's what's happening with your Instagram automations." />
      </div>

      {accounts.data && accounts.data.length === 0 ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-brand to-violet p-6 text-white">
          <div>
            <h2 className="text-lg font-semibold">Connect Instagram to start</h2>
            <p className="mt-1 max-w-xl text-sm text-white/80">
              Automations need a professional account. The connection uses Meta's real authorization URL.
            </p>
          </div>
          <Link to="/app/instagram/connect">
            <Button className="bg-white text-brand hover:bg-white/90">Connect Instagram</Button>
          </Link>
        </Card>
      ) : null}

      {overview.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : overview.isError ? (
        <Card>
          <ErrorState description={parseApiError(overview.error)} onRetry={() => void overview.refetch()} />
        </Card>
      ) : data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Comments" value={formatNumber(data.comments_received)} hint={`${formatNumber(data.comments_matched)} matched`} icon={<MessageCircle className="size-4" />} />
          <StatCard label="DMs sent" value={formatNumber(data.private_replies_sent)} hint={`${formatNumber(data.messages_sent)} messages total`} icon={<Send className="size-4" />} />
          <StatCard label="Leads" value={formatNumber(data.leads)} hint="Reported by the API" icon={<Users className="size-4" />} />
          <StatCard label="Conversion" value={formatPercent(rate)} hint="Private DMs divided by comments" icon={<Target className="size-4" />} />
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="Activity"
          description="All-time totals from the analytics overview."
        />
        <div className="space-y-4 p-4">
          <PendingNote>
            Last 7, 30, and 90 days are not available. The API returns lifetime totals and does not accept a date range.
          </PendingNote>
          {overview.isLoading ? <TableSkeleton rows={4} /> : <BarChartCard data={chartData} emptyTitle="No activity yet" emptyDescription="Comments and DMs will show up after an automation runs." />}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Recent automations"
          action={
            <Link to="/app/automations/new">
              <Button size="sm">Create automation</Button>
            </Link>
          }
        />
        {automations.isLoading ? (
          <TableSkeleton />
        ) : automations.isError ? (
          <ErrorState description={parseApiError(automations.error)} onRetry={() => void automations.refetch()} />
        ) : automations.data && automations.data.items.length === 0 ? (
          <EmptyState
            title="No automations"
            description="Create your first automation and turn Instagram comments into conversations."
            action={
              <Link to="/app/automations/new">
                <Button>Create automation</Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Trigger</TH>
                <TH>Status</TH>
                <TH>DMs</TH>
                <TH>Created</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {automations.data?.items.map((automation) => (
                <TR key={automation.id}>
                  <TD>
                    <Link className="font-medium hover:text-brand" to={`/app/automations/${automation.id}`}>
                      {automation.name}
                    </Link>
                  </TD>
                  <TD className="max-w-56 truncate text-muted">{triggerLabel(automation.trigger)}</TD>
                  <TD>
                    <StatusBadge status={automation.status} />
                  </TD>
                  <TD>
                    {privateDmCount(executions.data?.items ?? [], automation.id)}
                    {executions.data && executions.data.pagination.total > executions.data.items.length ? '+' : ''}
                  </TD>
                  <TD className="text-muted">{formatDate(automation.created_at)}</TD>
                  <TD>
                    <AutomationMenu automation={automation} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
