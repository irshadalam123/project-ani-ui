import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { GuestRoute, ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { renderWithProviders } from '@/test/render';
import type { User } from '@/types/auth';

const user: User = {
  id: 'user-1',
  email: 'demo@example.com',
  full_name: 'Demo User',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('protected routes', () => {
  it('sends anonymous users to login', () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<div>Secret</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      { route: '/app' },
    );
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('allows an authenticated user through', () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<div>Secret</div>} />
        </Route>
      </Routes>,
      {
        route: '/app',
        preloadedState: {
          auth: { user, token: 'token', isAuthenticated: true },
        },
      },
    );
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('sends authenticated users away from login', () => {
    renderWithProviders(
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
        </Route>
        <Route path="/app/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      {
        route: '/login',
        preloadedState: {
          auth: { user, token: 'token', isAuthenticated: true },
        },
      },
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
