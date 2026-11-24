import { Workflow } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAutomationsQuery } from '@/api/automationApi';
import { useGetExecutionsQuery } from '@/api/executionApi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { PendingNote } from '@/components/ui/PendingNote';
import { SearchInput } from '@/components/ui/SearchInput';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { AutomationMenu } from '@/features/automations/components/AutomationMenu';
import { privateDmCount, triggerLabel } from '@/features/automations/metrics';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { formatDate, formatRelative } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import type { AutomationStatus } from '@/types/automation';

const filters = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PAUSED', label: 'Paused' },
  { id: 'DRAFT', label: 'Draft' },
];

export default function AutomationListPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search);
  const automations = useGetAutomationsQuery({ page, page_size: 20 });
  const executions = useGetExecutionsQuery({ page: 1, page_size: 100 });

  const filtered = useMemo(() => {
    const items = automations.data?.items ?? [];
    const query = debounced.trim().toLowerCase();
    return items.filter((automation) => {
      const statusOk = status === 'ALL' || automation.status === (status as AutomationStatus);
      const searchOk =
        query.length === 0 ||
        automation.name.toLowerCase().includes(query) ||
        triggerLabel(automation.trigger).toLowerCase().includes(query);
      return statusOk && searchOk;
    });
  }, [automations.data?.items, debounced, status]);

  return (
    <div>
      <PageHeader
        description="Turn Instagram comments into conversations automatically."
        action={
          <Link to="/app/automations/new">
            <Button>Create automation</Button>
          </Link>
        }
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          label="Filter automations"
          tabs={filters}
          value={status}
          onChange={(id) => {
            setStatus(id);
            setPage(1);
          }}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search automations..." label="Search automations" />
      </div>
      <div className="mb-4">
        <PendingNote>
          Search and status filters apply to the current page. The API only accepts page and page_size.
        </PendingNote>
      </div>
      <Card>
        {automations.isLoading ? (
          <TableSkeleton />
        ) : automations.isError ? (
          <ErrorState description={parseApiError(automations.error)} onRetry={() => void automations.refetch()} />
        ) : automations.data && automations.data.items.length === 0 ? (
          <EmptyState
            icon={<Workflow className="size-5" />}
            title="No automations"
            description="Create your first automation and turn Instagram comments into conversations."
            action={
              <Link to="/app/automations/new">
                <Button>Create automation</Button>
              </Link>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" description="Try another keyword or status. Filters only look at this page." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Trigger</TH>
                <TH>Actions</TH>
                <TH>Status</TH>
                <TH>DMs</TH>
                <TH>Last activity</TH>
                <TH>Created</TH>
                <TH />
              </TR>
            </THead>
            <TBody>
              {filtered.map((automation) => (
                <TR key={automation.id}>
                  <TD>
                    <Link className="font-medium hover:text-brand" to={`/app/automations/${automation.id}`}>
                      {automation.name}
                    </Link>
                    {automation.description ? (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-faint">{automation.description}</p>
                    ) : null}
                  </TD>
                  <TD className="max-w-48 truncate text-muted">{triggerLabel(automation.trigger)}</TD>
                  <TD className="text-muted">{automation.actions.map((action) => action.type.replace('_', ' ')).join(', ')}</TD>
                  <TD>
                    <StatusBadge status={automation.status} />
                  </TD>
                  <TD>{privateDmCount(executions.data?.items ?? [], automation.id)}</TD>
                  <TD className="text-muted">{formatRelative(automation.updated_at)}</TD>
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
      {automations.data ? (
        <div className="mt-4">
          <Pagination
            page={automations.data.pagination.page}
            pageSize={automations.data.pagination.page_size}
            total={automations.data.pagination.total}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
