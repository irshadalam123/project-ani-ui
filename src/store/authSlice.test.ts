import { describe, expect, it } from 'vitest';
import { authReducer, logout, setSession } from '@/store/authSlice';
import type { User } from '@/types/auth';

const user: User = {
  id: 'user-1',
  email: 'demo@example.com',
  full_name: 'Demo User',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('auth slice', () => {
  it('stores the session and clears it on logout', () => {
    const signedIn = authReducer(
      { user: null, token: null, isAuthenticated: false },
      setSession({ token: 'token', user }),
    );
    expect(signedIn.isAuthenticated).toBe(true);
    expect(signedIn.token).toBe('token');
    const signedOut = authReducer(signedIn, logout());
    expect(signedOut.isAuthenticated).toBe(false);
    expect(signedOut.user).toBeNull();
  });
});
