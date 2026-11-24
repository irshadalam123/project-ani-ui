import { useState } from 'react';
import { Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { useCreateWorkspaceMutation } from '@/api/workspaceApi';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PendingNote } from '@/components/ui/PendingNote';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/components/ui/toast-context';
import { cn } from '@/lib/cn';
import { parseApiError } from '@/lib/errors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setNotificationPreferences } from '@/store/uiSlice';
import { setWorkspace } from '@/store/workspaceSlice';

const sections = [
  { to: '/app/settings/profile', label: 'Profile' },
  { to: '/app/settings/workspace', label: 'Workspace' },
  { to: '/app/settings/team', label: 'Team' },
  { to: '/app/settings/integrations', label: 'Instagram' },
  { to: '/app/settings/notifications', label: 'Notifications' },
  { to: '/app/settings/security', label: 'Security' },
  { to: '/app/billing', label: 'Billing' },
];

export default function SettingsPage() {
  const location = useLocation();
  if (location.pathname === '/app/settings') return <Navigate to="/app/settings/profile" replace />;

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav aria-label="Settings" className="flex gap-2 overflow-x-auto lg:flex-col">
        {sections.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            className={({ isActive }) =>
              cn(
                'rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap',
                isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface',
              )
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
      <SettingsSection />
    </div>
  );
}

function SettingsSection() {
  const { pathname } = useLocation();
  if (pathname.endsWith('/team')) return <TeamSettings />;
  if (pathname.endsWith('/integrations')) return <InstagramSettings />;
  if (pathname.endsWith('/notifications')) return <NotificationSettings />;
  if (pathname.endsWith('/security')) return <SecuritySettings />;
  if (pathname.endsWith('/workspace')) return <WorkspaceSettings />;
  return <ProfileSettings />;
}

function ProfileSettings() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Card>
      <CardHeader title="Profile" description="Name and email from your account." />
      <div className="space-y-4 p-5">
        <PendingNote>Profile updates are not available. The API can read the current user, not change it.</PendingNote>
        <Input label="Name" value={user?.full_name ?? ''} readOnly />
        <Input label="Email" value={user?.email ?? ''} readOnly />
      </div>
    </Card>
  );
}

function WorkspaceSettings() {
  const workspace = useAppSelector((state) => state.workspace.workspace);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [name, setName] = useState('');
  const [createWorkspace, state] = useCreateWorkspaceMutation();

  async function onCreate() {
    if (!name.trim()) return;
    try {
      const created = await createWorkspace({ name: name.trim() }).unwrap();
      dispatch(setWorkspace(created));
      setName('');
      toast.success('Workspace created');
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  return (
    <Card>
      <CardHeader title="Workspace" description="The workspace sent as X-Workspace-Id." />
      <div className="space-y-4 p-5">
        <Input label="Workspace name" value={workspace?.name ?? ''} readOnly />
        <PendingNote>Renaming a workspace is not available. You can create another one.</PendingNote>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="New workspace" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <Button loading={state.isLoading} onClick={() => void onCreate()}>
            Create workspace
          </Button>
        </div>
      </div>
    </Card>
  );
}

function TeamSettings() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Card>
      <CardHeader title="Team" description="Members and invites." />
      <div className="space-y-4 p-5">
        <PendingNote>Team management is not available yet. There is no members or invite endpoint.</PendingNote>
        <div className="flex items-center justify-between rounded-xl border border-line px-3 py-3 text-sm">
          <span>{user?.full_name}</span>
          <span className="text-muted">Owner</span>
        </div>
        <Button disabled>Invite</Button>
      </div>
    </Card>
  );
}

function InstagramSettings() {
  const accounts = useGetInstagramAccountsQuery();
  return (
    <Card>
      <CardHeader title="Instagram" description="Accounts connected to this workspace." />
      <div className="space-y-3 p-5">
        {accounts.data?.length ? (
          accounts.data.map((account) => (
            <div key={account.id} className="rounded-xl border border-line px-3 py-3 text-sm">
              @{account.username}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No accounts connected.</p>
        )}
        <Link to="/app/instagram" className="text-sm font-medium text-brand">
          Manage accounts
        </Link>
      </div>
    </Card>
  );
}

function NotificationSettings() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.ui.notifications);
  return (
    <Card>
      <CardHeader title="Notifications" description="Saved on this device." />
      <div className="space-y-5 p-5">
        <PendingNote>These toggles stay in the browser. The API does not send email yet.</PendingNote>
        <Switch
          label="Email notifications"
          checked={preferences.email}
          onCheckedChange={(email) => dispatch(setNotificationPreferences({ ...preferences, email }))}
        />
        <Switch
          label="Automation failures"
          checked={preferences.automationFailures}
          onCheckedChange={(automationFailures) =>
            dispatch(setNotificationPreferences({ ...preferences, automationFailures }))
          }
        />
        <Switch
          label="Weekly reports"
          checked={preferences.weeklyReports}
          onCheckedChange={(weeklyReports) => dispatch(setNotificationPreferences({ ...preferences, weeklyReports }))}
        />
      </div>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <Card>
      <CardHeader title="Security" description="Password and sessions." />
      <div className="space-y-4 p-5">
        <PendingNote>Password changes and session revocation are not available yet.</PendingNote>
        <Input label="Current password" type="password" disabled value="" />
        <Input label="New password" type="password" disabled value="" />
        <Button disabled>Update password</Button>
      </div>
    </Card>
  );
}
