import { Bell, ChevronDown, LifeBuoy, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useMatches, useNavigate } from 'react-router-dom';
import { useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { useGetWorkspacesQuery } from '@/api/workspaceApi';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { baseApi } from '@/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { setMobileMenuOpen, setTheme, type ThemePreference } from '@/store/uiSlice';
import { clearWorkspace, setSelectedInstagramAccountId, setWorkspace } from '@/store/workspaceSlice';

interface RouteHandle {
  title?: string;
  breadcrumb?: string;
}

export function Topbar() {
  const matches = useMatches();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const theme = useAppSelector((state) => state.ui.theme);
  const selectedAccountId = useAppSelector((state) => state.workspace.selectedInstagramAccountId);
  const workspaceId = useAppSelector((state) => state.workspace.selectedWorkspaceId);
  const accounts = useGetInstagramAccountsQuery();
  const workspaces = useGetWorkspacesQuery();
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    const list = accounts.data ?? [];
    if (list.length === 0) return;
    if (!selectedAccountId || !list.some((account) => account.id === selectedAccountId)) {
      dispatch(setSelectedInstagramAccountId(list[0]?.id ?? null));
    }
  }, [accounts.data, dispatch, selectedAccountId]);

  const crumbs = matches
    .map((match) => match.handle as RouteHandle | undefined)
    .filter((handle): handle is RouteHandle => Boolean(handle?.breadcrumb));
  const title = [...crumbs].reverse()[0]?.title ?? 'Dashboard';
  const selected = accounts.data?.find((account) => account.id === selectedAccountId);

  function signOut() {
    dispatch(logout());
    dispatch(clearWorkspace());
    dispatch(baseApi.util.resetApiState());
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur md:px-6">
      <button
        type="button"
        className="rounded-lg p-2 text-muted hover:bg-surface md:hidden"
        aria-label="Open navigation"
        onClick={() => dispatch(setMobileMenuOpen(true))}
      >
        <Menu className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="hidden text-xs text-faint sm:block">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.breadcrumb}-${index}`}>
              {index > 0 ? <span className="px-1">/</span> : null}
              {crumb.breadcrumb}
            </span>
          ))}
        </nav>
        <h1 className="truncate text-base font-semibold tracking-tight text-ink">{title}</h1>
      </div>
      <Dropdown
        label="Instagram accounts"
        trigger={
          <button
            type="button"
            className="hidden h-10 max-w-52 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink sm:inline-flex"
          >
            <span className="truncate">{selected ? `@${selected.username}` : 'Instagram account'}</span>
            <ChevronDown className="size-4 text-faint" aria-hidden="true" />
          </button>
        }
        items={
          accounts.data && accounts.data.length > 0
            ? accounts.data.map((account) => ({
                label: `@${account.username}`,
                onSelect: () => dispatch(setSelectedInstagramAccountId(account.id)),
              }))
            : [{ label: 'Connect Instagram', onSelect: () => navigate('/app/instagram/connect') }]
        }
      />
      <div className="relative">
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"
          aria-label="Notifications"
          aria-expanded={notesOpen}
          onClick={() => setNotesOpen((open) => !open)}
        >
          <Bell className="size-4" />
        </button>
        {notesOpen ? (
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-line bg-surface p-4 text-sm shadow-pop">
            <p className="font-medium text-ink">No new notifications</p>
            <p className="mt-1 text-xs text-muted">The API does not send in-app notifications yet.</p>
          </div>
        ) : null}
      </div>
      <Link to="/app/help" className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink" aria-label="Help">
        <LifeBuoy className="size-4" />
      </Link>
      <Dropdown
        label="Account menu"
        trigger={
          <button type="button" className="rounded-full" aria-label="Account menu">
            <Avatar name={user?.full_name ?? 'Account'} size="sm" />
          </button>
        }
        items={[
          { label: 'Profile', onSelect: () => navigate('/app/settings/profile') },
          ...(workspaces.data ?? [])
            .filter((workspace) => workspace.id !== workspaceId)
            .map((workspace) => ({
              label: `Switch to ${workspace.name}`,
              onSelect: () => {
                dispatch(setWorkspace(workspace));
                dispatch(baseApi.util.resetApiState());
              },
            })),
          { label: themeLabel(theme), onSelect: () => dispatch(setTheme(nextTheme(theme))) },
          { label: 'Sign out', tone: 'danger' as const, onSelect: signOut },
        ]}
      />
    </header>
  );
}

function nextTheme(theme: ThemePreference): ThemePreference {
  if (theme === 'light') return 'dark';
  if (theme === 'dark') return 'system';
  return 'light';
}

function themeLabel(theme: ThemePreference): string {
  if (theme === 'light') return 'Theme: Light';
  if (theme === 'dark') return 'Theme: Dark';
  return 'Theme: System';
}
