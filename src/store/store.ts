import { configureStore } from '@reduxjs/toolkit';
import { baseApi, resetUnauthorizedRedirect, setUnauthorizedHandler } from '@/api/baseApi';
import { analyticsApi } from '@/api/analyticsApi';
import { authApi } from '@/api/authApi';
import { automationApi } from '@/api/automationApi';
import { billingApi } from '@/api/billingApi';
import { contactApi } from '@/api/contactApi';
import { conversationApi } from '@/api/conversationApi';
import { executionApi } from '@/api/executionApi';
import { instagramApi } from '@/api/instagramApi';
import { workspaceApi } from '@/api/workspaceApi';
import { authReducer, logout, persistAuth, setSession, type AuthState } from '@/store/authSlice';
import { persistUi, uiReducer, type UiState } from '@/store/uiSlice';
import {
  clearWorkspace,
  persistWorkspace,
  setWorkspace,
  workspaceReducer,
  type WorkspaceState,
} from '@/store/workspaceSlice';

export const rootReducer = {
  auth: authReducer,
  ui: uiReducer,
  workspace: workspaceReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface TestPreloadedState {
  auth?: AuthState;
  ui?: UiState;
  workspace?: WorkspaceState;
}

export function setupStore(preloadedState?: TestPreloadedState) {
  const testStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
  if (preloadedState?.auth?.token && preloadedState.auth.user) {
    testStore.dispatch(setSession({ token: preloadedState.auth.token, user: preloadedState.auth.user }));
  }
  if (preloadedState?.workspace?.workspace) {
    testStore.dispatch(setWorkspace(preloadedState.workspace.workspace));
  }
  return testStore;
}

setUnauthorizedHandler(() => {
  store.dispatch(logout());
  store.dispatch(clearWorkspace());
  store.dispatch(baseApi.util.resetApiState());
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login');
    return;
  }
  resetUnauthorizedRedirect();
});

let lastPersist = '';
store.subscribe(() => {
  const state = store.getState();
  const snapshot = JSON.stringify({
    auth: state.auth,
    ui: {
      sidebarCollapsed: state.ui.sidebarCollapsed,
      theme: state.ui.theme,
      notifications: state.ui.notifications,
    },
    workspace: state.workspace,
  });
  if (snapshot === lastPersist) return;
  lastPersist = snapshot;
  persistAuth(state.auth);
  persistUi(state.ui);
  persistWorkspace(state.workspace);
});

void authApi;
void analyticsApi;
void automationApi;
void billingApi;
void contactApi;
void conversationApi;
void executionApi;
void instagramApi;
void workspaceApi;
