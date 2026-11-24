/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { GuestRoute, ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { useAppSelector } from '@/store/hooks';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('@/features/auth/pages/NotFoundPage'));
const OnboardingPage = lazy(() => import('@/features/onboarding/pages/OnboardingPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AutomationListPage = lazy(() => import('@/features/automations/pages/AutomationListPage'));
const AutomationBuilderPage = lazy(() => import('@/features/automations/pages/AutomationBuilderPage'));
const AutomationDetailPage = lazy(() => import('@/features/automations/pages/AutomationDetailPage'));
const InstagramPage = lazy(() => import('@/features/instagram/pages/InstagramPage'));
const ConnectInstagramPage = lazy(() => import('@/features/instagram/pages/ConnectInstagramPage'));
const InboxPage = lazy(() => import('@/features/inbox/pages/InboxPage'));
const ContactsPage = lazy(() => import('@/features/contacts/pages/ContactsPage'));
const ContactDetailPage = lazy(() => import('@/features/contacts/pages/ContactDetailPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const BillingPage = lazy(() => import('@/features/billing/pages/BillingPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const HelpPage = lazy(() => import('@/features/help/pages/HelpPage'));

function RootRedirect() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/app/dashboard' : '/login'} replace />;
}

const appHandle = {
  dashboard: { title: 'Dashboard', breadcrumb: 'Dashboard' },
  automations: { title: 'Automations', breadcrumb: 'Automations' },
  newAutomation: { title: 'Create automation', breadcrumb: 'Create' },
  automation: { title: 'Automation', breadcrumb: 'Automation' },
  editAutomation: { title: 'Edit automation', breadcrumb: 'Edit' },
  instagram: { title: 'Instagram', breadcrumb: 'Instagram' },
  connect: { title: 'Connect Instagram', breadcrumb: 'Connect' },
  inbox: { title: 'Inbox', breadcrumb: 'Inbox' },
  contacts: { title: 'Contacts', breadcrumb: 'Contacts' },
  contact: { title: 'Contact', breadcrumb: 'Contact' },
  analytics: { title: 'Analytics', breadcrumb: 'Analytics' },
  billing: { title: 'Billing', breadcrumb: 'Billing' },
  settings: { title: 'Settings', breadcrumb: 'Settings' },
  help: { title: 'Help Center', breadcrumb: 'Help' },
  onboarding: { title: 'Onboarding', breadcrumb: 'Onboarding' },
};

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/app/onboarding', element: <OnboardingPage />, handle: appHandle.onboarding },
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage />, handle: appHandle.dashboard },
          { path: 'automations', element: <AutomationListPage />, handle: appHandle.automations },
          { path: 'automations/new', element: <AutomationBuilderPage />, handle: appHandle.newAutomation },
          { path: 'automations/:id', element: <AutomationDetailPage />, handle: appHandle.automation },
          { path: 'automations/:id/edit', element: <AutomationBuilderPage />, handle: appHandle.editAutomation },
          { path: 'instagram', element: <InstagramPage />, handle: appHandle.instagram },
          { path: 'instagram/connect', element: <ConnectInstagramPage />, handle: appHandle.connect },
          { path: 'inbox', element: <InboxPage />, handle: appHandle.inbox },
          { path: 'inbox/:conversationId', element: <InboxPage />, handle: appHandle.inbox },
          { path: 'contacts', element: <ContactsPage />, handle: appHandle.contacts },
          { path: 'contacts/:contactId', element: <ContactDetailPage />, handle: appHandle.contact },
          { path: 'analytics', element: <AnalyticsPage />, handle: appHandle.analytics },
          { path: 'billing', element: <BillingPage />, handle: appHandle.billing },
          { path: 'settings', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/profile', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/workspace', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/team', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/integrations', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/notifications', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'settings/security', element: <SettingsPage />, handle: appHandle.settings },
          { path: 'help', element: <HelpPage />, handle: appHandle.help },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
