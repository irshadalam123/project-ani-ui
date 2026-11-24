import { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMeQuery } from '@/api/authApi';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Topbar } from '@/components/layout/Topbar';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/authSlice';
import { setMobileMenuOpen, toggleSidebar } from '@/store/uiSlice';

export function AppShell() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const mobileOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const location = useLocation();
  const me = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (me.data) dispatch(setUser(me.data));
  }, [dispatch, me.data]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        dispatch(toggleSidebar());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex">
        <Sidebar />
      </div>
      <SidebarSpacer />
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close navigation"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-pop">
            <Sidebar forceExpanded />
          </div>
        </div>
      ) : null}
      <div className="flex min-h-svh min-w-0 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
          <div className="page-enter mx-auto w-full max-w-6xl">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function SidebarSpacer() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  return <div className={collapsed ? 'hidden md:block md:w-[76px]' : 'hidden md:block md:w-64'} />;
}
