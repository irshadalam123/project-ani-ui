import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isRecord, readJson, writeJson } from '@/lib/storage';

const UI_KEY = 'cmmdm.ui';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface NotificationPreferences {
  email: boolean;
  automationFailures: boolean;
  weeklyReports: boolean;
}

export interface UiState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  theme: ThemePreference;
  notifications: NotificationPreferences;
}

const defaultNotifications: NotificationPreferences = {
  email: true,
  automationFailures: true,
  weeklyReports: false,
};

function isTheme(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function loadUi(): UiState {
  const parsed = readJson(UI_KEY);
  const notifications = { ...defaultNotifications };
  if (isRecord(parsed) && isRecord(parsed.notifications)) {
    if (typeof parsed.notifications.email === 'boolean') notifications.email = parsed.notifications.email;
    if (typeof parsed.notifications.automationFailures === 'boolean') {
      notifications.automationFailures = parsed.notifications.automationFailures;
    }
    if (typeof parsed.notifications.weeklyReports === 'boolean') {
      notifications.weeklyReports = parsed.notifications.weeklyReports;
    }
  }
  return {
    sidebarCollapsed: isRecord(parsed) && parsed.sidebarCollapsed === true,
    mobileMenuOpen: false,
    theme: isRecord(parsed) && isTheme(parsed.theme) ? parsed.theme : 'system',
    notifications,
  };
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: loadUi(),
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
    setNotificationPreferences(state, action: PayloadAction<NotificationPreferences>) {
      state.notifications = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setTheme,
  setNotificationPreferences,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export function persistUi(state: UiState): void {
  writeJson(UI_KEY, {
    sidebarCollapsed: state.sidebarCollapsed,
    theme: state.theme,
    notifications: state.notifications,
  });
}
