import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { apiBaseUrl } from '@/config';
import type { AuthState } from '@/store/authSlice';
import type { WorkspaceState } from '@/store/workspaceSlice';

interface QueryState {
  auth: AuthState;
  workspace: WorkspaceState;
}

let unauthorizedHandler: (() => void) | null = null;
let redirecting = false;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

function requestUrl(args: string | FetchArgs): string {
  return typeof args === 'string' ? args : args.url;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as QueryState;
    if (state.auth.token) {
      headers.set('Authorization', `Bearer ${state.auth.token}`);
    }
    if (state.workspace.selectedWorkspaceId) {
      headers.set('X-Workspace-Id', state.workspace.selectedWorkspaceId);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = requestUrl(args);
  const isCredentialAttempt = url.includes('/auth/login') || url.includes('/auth/register');
  const isTest = import.meta.env.MODE === 'test';
  if (result.error?.status === 401 && !isCredentialAttempt && !redirecting && !isTest) {
    redirecting = true;
    unauthorizedHandler?.();
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Auth',
    'Instagram',
    'Automations',
    'Contacts',
    'Conversations',
    'Analytics',
    'Billing',
    'Executions',
    'Workspaces',
  ],
  endpoints: () => ({}),
});

export function resetUnauthorizedRedirect(): void {
  redirecting = false;
}
