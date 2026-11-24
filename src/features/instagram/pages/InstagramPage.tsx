import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDisconnectInstagramAccountMutation, useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/toast-context';
import { formatDateTime } from '@/lib/format';
import { parseApiError } from '@/lib/errors';
import { Camera } from 'lucide-react';

export default function InstagramPage() {
  const accounts = useGetInstagramAccountsQuery();
  const [disconnect, disconnectState] = useDisconnectInstagramAccountMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();

  async function confirmDisconnect() {
    if (!pendingId) return;
    try {
      await disconnect(pendingId).unwrap();
      toast.success('Instagram disconnected');
      setPendingId(null);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  return (
    <div>
      <PageHeader
        description="Professional accounts connected to this workspace."
        action={
          <Link to="/app/instagram/connect">
            <Button>Connect Instagram</Button>
          </Link>
        }
      />
      {accounts.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : accounts.isError ? (
        <Card>
          <ErrorState description={parseApiError(accounts.error)} onRetry={() => void accounts.refetch()} />
        </Card>
      ) : accounts.data && accounts.data.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Camera className="size-5" />}
            title="No Instagram account connected"
            description="Connect a professional account to automate comments and DMs."
            action={
              <Link to="/app/instagram/connect">
                <Button>Connect Instagram</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.data?.map((account) => (
            <Card key={account.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={account.username} src={account.profile_picture_url} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold">@{account.username}</h2>
                    <span className={account.webhook_subscribed ? 'size-2 rounded-full bg-success' : 'size-2 rounded-full bg-warning'} aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted">{account.name || 'Instagram professional account'}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-faint">Account type</dt>
                  <dd>{account.account_type || 'Professional'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">Connection</dt>
                  <dd>
                    <Badge tone={account.webhook_subscribed ? 'success' : 'warning'}>
                      {account.webhook_subscribed ? 'Subscribed' : 'Connected'}
                    </Badge>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-faint">Last synchronized</dt>
                  <dd>{formatDateTime(account.updated_at)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Link to="/app/automations">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setPendingId(account.id)}>
                  Disconnect
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={pendingId !== null}
        title="Disconnect Instagram?"
        description="Automations for this account will stop receiving comments."
        confirmLabel="Disconnect"
        loading={disconnectState.isLoading}
        onClose={() => setPendingId(null)}
        onConfirm={() => void confirmDisconnect()}
      />
    </div>
  );
}
