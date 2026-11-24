import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}
