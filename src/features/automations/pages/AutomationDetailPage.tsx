import { Link, useParams } from 'react-router-dom';
import { useGetAutomationQuery } from '@/api/automationApi';
import { useGetExecutionsQuery } from '@/api/executionApi';
import { StatCard } from '@/components/charts/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { PendingNote } from '@/components/ui/PendingNote';
import { AutomationMenu } from '@/features/automations/components/AutomationMenu';
import { failureCount, privateDmCount, triggerLabel } from '@/features/automations/metrics';
import { formatDateTime } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import { MessageCircle, Send, Target, TriangleAlert } from 'lucide-react';

export default function AutomationDetailPage() {
  const { id = '' } = useParams();
  const automation = useGetAutomationQuery(id, { skip: !id });
  const executions = useGetExecutionsQuery({ automation_id: id, page: 1, page_size: 20 }, { skip: !id });
  const item = automation.data;
  const rows = executions.data?.items ?? [];

  if (automation.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }
  if (automation.isError || !item) {
    return <ErrorState description={parseApiError(automation.error)} onRetry={() => void automation.refetch()} />;
  }

  const matched = new Set(rows.map((execution) => execution.comment_id)).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{item.name}</h2>
            <StatusBadge status={item.status} />
          </div>
          <PageHeader description={item.description || 'No description yet.'} />
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/app/automations/${item.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <AutomationMenu automation={item} />
        </div>
      </div>
      <Card className="grid gap-4 p-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-faint uppercase">Trigger</p>
          <p className="mt-1 text-sm">{triggerLabel(item.trigger)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-faint uppercase">Actions</p>
          <ul className="mt-1 space-y-2 text-sm">
            {item.actions.map((action, index) => (
              <li key={`${action.type}-${index}`} className="rounded-xl bg-surface-muted px-3 py-2">
                <span className="font-medium">{action.type === 'PUBLIC_REPLY' ? 'Public reply' : 'Private DM'}</span>
                <p className="mt-1 whitespace-pre-wrap text-muted">{action.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Comments" value={String(matched)} hint="Unique comment ids in this page of history" icon={<MessageCircle className="size-4" />} />
        <StatCard label="Matched" value={String(rows.length)} hint="Executions loaded" icon={<Target className="size-4" />} />
        <StatCard label="DMs" value={String(privateDmCount(rows, item.id))} hint="Successful private replies" icon={<Send className="size-4" />} />
        <StatCard label="Failures" value={String(failureCount(rows, item.id))} hint="Failed executions" icon={<TriangleAlert className="size-4" />} />
      </div>
      <Card>
        <CardHeader title="Execution history" description="Time, comment, and status from the executions API." />
        <div className="p-4">
          <PendingNote>The execution record includes a comment id, not the commenter's username or the comment text.</PendingNote>
        </div>
        {executions.isLoading ? (
          <TableSkeleton />
        ) : executions.isError ? (
          <ErrorState description={parseApiError(executions.error)} onRetry={() => void executions.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState title="No executions yet" description="History appears after a matching comment is processed." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Time</TH>
                <TH>Comment</TH>
                <TH>Status</TH>
                <TH>Error</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((execution) => (
                <TR key={execution.id}>
                  <TD>{formatDateTime(execution.created_at)}</TD>
                  <TD className="font-mono text-xs">{execution.comment_id}</TD>
                  <TD>{execution.status}</TD>
                  <TD className="text-muted">{execution.error || '—'}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
