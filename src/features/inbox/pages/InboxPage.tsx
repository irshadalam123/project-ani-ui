import { Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetContactsQuery } from '@/api/contactApi';
import { useGetConversationQuery, useGetConversationsQuery, useGetMessagesQuery } from '@/api/conversationApi';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConversationSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/toast-context';
import { contactLabel, formatRelative } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import { cn } from '@/lib/cn';
import type { Contact } from '@/types/contact';

export default function InboxPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [draft, setDraft] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const conversations = useGetConversationsQuery({ page: 1, page_size: 50 });
  const contacts = useGetContactsQuery({ page: 1, page_size: 100 });
  const conversation = useGetConversationQuery(conversationId ?? '', { skip: !conversationId });
  const messages = useGetMessagesQuery(
    { conversationId: conversationId ?? '', page: 1, page_size: 100 },
    { skip: !conversationId },
  );

  const contactMap = useMemo(() => {
    const map = new Map<string, Contact>();
    contacts.data?.items.forEach((contact) => map.set(contact.id, contact));
    return map;
  }, [contacts.data?.items]);

  const activeContact = conversation.data ? contactMap.get(conversation.data.contact_id) : undefined;

  return (
    <Card className="grid min-h-[70svh] overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
      <section className={cn('border-line lg:border-r', conversationId ? 'hidden lg:block' : 'block')}>
        <div className="border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold">Conversations</h2>
        </div>
        {conversations.isLoading ? (
          <ConversationSkeleton />
        ) : conversations.isError ? (
          <ErrorState description={parseApiError(conversations.error)} onRetry={() => void conversations.refetch()} />
        ) : conversations.data && conversations.data.items.length === 0 ? (
          <EmptyState title="No conversations" description="Replies from automations will show up here." />
        ) : (
          <ul>
            {conversations.data?.items.map((item) => {
              const contact = contactMap.get(item.contact_id);
              const name = contact ? contactLabel(contact) : 'Contact';
              return (
                <li key={item.id}>
                  <Link
                    to={`/app/inbox/${item.id}`}
                    className={cn(
                      'flex gap-3 px-4 py-3 hover:bg-surface-muted',
                      item.id === conversationId ? 'bg-brand-soft' : '',
                    )}
                  >
                    <Avatar name={name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{name}</span>
                        <span className="text-[11px] text-faint">{formatRelative(item.updated_at)}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{item.status === 'OPEN' ? 'Open conversation' : 'Closed'}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={cn('flex min-h-[60svh] flex-col', conversationId ? 'flex' : 'hidden lg:flex')}>
        {!conversationId ? (
          <EmptyState title="Select a conversation" description="Choose a thread to read the messages stored for this workspace." />
        ) : messages.isLoading || conversation.isLoading ? (
          <ConversationSkeleton />
        ) : messages.isError || conversation.isError ? (
          <ErrorState
            description={parseApiError(messages.error ?? conversation.error)}
            onRetry={() => {
              void messages.refetch();
              void conversation.refetch();
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <button type="button" className="text-xs text-brand lg:hidden" onClick={() => navigate('/app/inbox')}>
                  Back
                </button>
                <h2 className="text-sm font-semibold">{activeContact ? contactLabel(activeContact) : 'Conversation'}</h2>
              </div>
              <Button variant="ghost" size="sm" className="xl:hidden" onClick={() => setDetailsOpen(true)}>
                Details
              </Button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <Badge tone="brand">Triggered by an automation</Badge>
              {messages.data?.items.length === 0 ? (
                <p className="text-sm text-muted">No messages in this conversation.</p>
              ) : (
                messages.data?.items.map((message) => (
                  <div key={message.id} className={cn('flex', message.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                        message.direction === 'OUTBOUND' ? 'bg-brand text-white' : 'bg-surface-muted text-ink',
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={cn('mt-1 text-[10px]', message.direction === 'OUTBOUND' ? 'text-white/70' : 'text-faint')}>
                        {message.direction === 'INBOUND' ? 'Inbound' : 'Outbound'} · {formatRelative(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form
              className="flex gap-2 border-t border-line p-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                toast.info('Sending messages from the inbox is not available yet.');
              }}
            >
              <label className="sr-only" htmlFor="composer">
                Type a message
              </label>
              <input
                id="composer"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message..."
                className="h-11 flex-1 rounded-xl border border-line bg-surface px-3 text-sm"
              />
              <Button type="submit" aria-label="Send message">
                <Send className="size-4" />
              </Button>
            </form>
          </>
        )}
      </section>

      <aside className={cn('hidden border-l border-line xl:block', detailsOpen ? 'block' : '')}>
        <ContactPanel contact={activeContact} onClose={() => setDetailsOpen(false)} />
      </aside>
      {detailsOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close details" onClick={() => setDetailsOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[min(100%,320px)] bg-surface shadow-pop">
            <ContactPanel contact={activeContact} onClose={() => setDetailsOpen(false)} />
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function ContactPanel({ contact, onClose }: { contact: Contact | undefined; onClose: () => void }) {
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between xl:hidden">
        <h3 className="text-sm font-semibold">Contact</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      {contact ? (
        <div className="space-y-3">
          <Avatar name={contactLabel(contact)} size="lg" />
          <div>
            <p className="font-semibold">{contactLabel(contact)}</p>
            <p className="text-sm text-muted">{contact.username ? `@${contact.username}` : 'No username'}</p>
          </div>
          <Link to={`/app/contacts/${contact.id}`} className="text-sm font-medium text-brand">
            View contact
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted">Contact details appear when a conversation is selected.</p>
      )}
    </div>
  );
}
