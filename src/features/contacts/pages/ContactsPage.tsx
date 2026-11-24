import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetContactsQuery } from '@/api/contactApi';
import { useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { PendingNote } from '@/components/ui/PendingNote';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { contactLabel, formatDate, formatRelative } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import { Users } from 'lucide-react';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [accountId, setAccountId] = useState('ALL');
  const debounced = useDebouncedValue(search);
  const contacts = useGetContactsQuery({ page, page_size: 20 });
  const accounts = useGetInstagramAccountsQuery();

  const rows = useMemo(() => {
    const query = debounced.trim().toLowerCase();
    return (contacts.data?.items ?? []).filter((contact) => {
      const accountOk = accountId === 'ALL' || contact.instagram_account_id === accountId;
      const haystack = [contact.username, contact.first_name, contact.last_name].filter(Boolean).join(' ').toLowerCase();
      return accountOk && (query.length === 0 || haystack.includes(query));
    });
  }, [accountId, contacts.data?.items, debounced]);

  return (
    <div>
      <PageHeader description="People who have commented or received a DM." />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search contacts..." />
        <div className="w-full sm:max-w-xs">
          <Select aria-label="Filter by account" value={accountId} onChange={(event) => setAccountId(event.target.value)}>
            <option value="ALL">All accounts</option>
            {accounts.data?.map((account) => (
              <option key={account.id} value={account.id}>
                @{account.username}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mb-4">
        <PendingNote>Search filters this page. The contacts API does not accept a search parameter yet.</PendingNote>
      </div>
      <Card>
        {contacts.isLoading ? (
          <TableSkeleton />
        ) : contacts.isError ? (
          <ErrorState description={parseApiError(contacts.error)} onRetry={() => void contacts.refetch()} />
        ) : contacts.data && contacts.data.items.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="No contacts yet"
            description="Contacts are created when an automation replies to a comment."
          />
        ) : rows.length === 0 ? (
          <EmptyState title="No matches" description="Nothing on this page matches that search." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Username</TH>
                <TH>Campaign</TH>
                <TH>Status</TH>
                <TH>Last interaction</TH>
                <TH>Created</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((contact) => (
                <TR key={contact.id}>
                  <TD>
                    <Link to={`/app/contacts/${contact.id}`} className="flex items-center gap-3 font-medium hover:text-brand">
                      <Avatar name={contactLabel(contact)} size="sm" />
                      {contactLabel(contact)}
                    </Link>
                  </TD>
                  <TD className="text-muted">{contact.username ? `@${contact.username}` : '—'}</TD>
                  <TD className="text-muted">{contact.metadata.campaign || '—'}</TD>
                  <TD className="text-muted">{contact.metadata.status || '—'}</TD>
                  <TD className="text-muted">{formatRelative(contact.updated_at)}</TD>
                  <TD className="text-muted">{formatDate(contact.created_at)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
      {contacts.data ? (
        <div className="mt-4">
          <Pagination
            page={contacts.data.pagination.page}
            pageSize={contacts.data.pagination.page_size}
            total={contacts.data.pagination.total}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
