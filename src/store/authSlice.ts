import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isRecord, readJson, removeKey, writeJson } from '@/lib/storage';
import type { User } from '@/types/auth';

const AUTH_KEY = 'cmmdm.auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.full_name === 'string' &&
    typeof value.is_active === 'boolean' &&
    typeof value.created_at === 'string' &&
    typeof value.updated_at === 'string'
  );
}

function loadAuth(): AuthState {
  const parsed = readJson(AUTH_KEY);
  if (!isRecord(parsed) || typeof parsed.token !== 'string' || !isUser(parsed.user)) {
    return { user: null, token: null, isAuthenticated: false };
  }
  return { user: parsed.user, token: parsed.token, isAuthenticated: true };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuth(),
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setSession, setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export function persistAuth(state: AuthState): void {
  if (!state.token || !state.user) {
    removeKey(AUTH_KEY);
    return;
  }
  writeJson(AUTH_KEY, { token: state.token, user: state.user });
}
