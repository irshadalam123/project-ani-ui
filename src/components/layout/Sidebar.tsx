import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { helpNav, primaryNav, secondaryNav } from '@/components/layout/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/uiSlice';

export function Sidebar({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed) && !forceExpanded;
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-line bg-surface transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-line px-3', collapsed ? 'justify-center' : 'justify-between')}>
        <Logo collapsed={collapsed} />
        {forceExpanded ? null : (
          <button
            type="button"
            className={cn('rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-ink', collapsed ? 'hidden' : '')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => dispatch(toggleSidebar())}
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>
      {collapsed && !forceExpanded ? (
        <button
          type="button"
          className="mx-auto mt-3 rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-ink"
          aria-label="Expand sidebar"
          onClick={() => dispatch(toggleSidebar())}
        >
          <PanelLeftOpen className="size-4" />
        </button>
      ) : null}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {primaryNav.map((item) => (
          <SidebarLink key={item.to} {...item} collapsed={collapsed} />
        ))}
        <div className="my-3 h-px bg-line" />
        {secondaryNav.map((item) => (
          <SidebarLink key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-line px-3 py-3">
        <SidebarLink {...helpNav} collapsed={collapsed} />
        <NavLink
          to="/app/settings/profile"
          title={collapsed ? user?.full_name : undefined}
          className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-surface-muted"
        >
          <Avatar name={user?.full_name ?? 'Account'} size="sm" />
          {collapsed ? null : (
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{user?.full_name}</span>
              <span className="block truncate text-xs text-faint">{user?.email}</span>
            </span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: (typeof primaryNav)[number]['icon'];
  collapsed: boolean;
}) {
  const link = (
    <NavLink
      to={to}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition',
          collapsed ? 'justify-center' : '',
          isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface-muted hover:text-ink',
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {collapsed ? null : <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (!collapsed) return link;
  return (
    <Tooltip content={label} side="right">
      {link}
    </Tooltip>
  );
}
