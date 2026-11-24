import { Link, useParams } from 'react-router-dom';
import { useGetContactQuery } from '@/api/contactApi';
import { useGetConversationsQuery } from '@/api/conversationApi';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { contactLabel, formatDateTime } from '@/lib/format';
import { parseApiError } from '@/lib/errors';

export default function ContactDetailPage() {
  const { contactId = '' } = useParams();
  const contact = useGetContactQuery(contactId, { skip: !contactId });
  const conversations = useGetConversationsQuery({ page: 1, page_size: 50 });
  const item = contact.data;
  const related = (conversations.data?.items ?? []).filter((conversation) => conversation.contact_id === contactId);
  const tags = item ? Object.entries(item.metadata) : [];

  if (contact.isLoading) return <CardSkeleton />;
  if (contact.isError || !item) {
    return <ErrorState description={parseApiError(contact.error)} onRetry={() => void contact.refetch()} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="p-5">
        <Avatar name={contactLabel(item)} size="lg" />
        <h2 className="mt-4 text-xl font-semibold">{contactLabel(item)}</h2>
        <p className="text-sm text-muted">{item.username ? `@${item.username}` : 'No username stored'}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-xs text-faint">Instagram user id</dt>
            <dd className="font-mono text-xs">{item.instagram_user_id}</dd>
          </div>
          <div>
            <dt className="text-xs text-faint">Created</dt>
            <dd>{formatDateTime(item.created_at)}</dd>
          </div>
        </dl>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader title="Tags" description="Values stored on the contact metadata map." />
          <div className="flex flex-wrap gap-2 p-4">
            {tags.length === 0 ? <p className="text-sm text-muted">No tags yet.</p> : tags.map(([key, value]) => (
              <Badge key={key} tone="brand">{key}: {value}</Badge>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Conversations" />
          {related.length === 0 ? (
            <EmptyState title="No conversations" description="This contact does not have a conversation in the current page of results." />
          ) : (
            <ul className="divide-y divide-line">
              {related.map((conversation) => (
                <li key={conversation.id}>
                  <Link className="block px-4 py-3 text-sm hover:bg-surface-muted" to={`/app/inbox/${conversation.id}`}>
                    {conversation.status} · {formatDateTime(conversation.updated_at)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Activity" description="Created and last update from the contact record." />
          <ol className="space-y-3 p-4 text-sm">
            <li>Created {formatDateTime(item.created_at)}</li>
            <li>Updated {formatDateTime(item.updated_at)}</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
