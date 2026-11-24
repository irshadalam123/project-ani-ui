import {
  Camera,
  ChartColumn,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/automations', label: 'Automations', icon: Workflow },
  { to: '/app/instagram', label: 'Instagram', icon: Camera },
  { to: '/app/inbox', label: 'Inbox', icon: Inbox },
  { to: '/app/contacts', label: 'Contacts', icon: Users },
  { to: '/app/analytics', label: 'Analytics', icon: ChartColumn },
];

export const secondaryNav: NavItem[] = [
  { to: '/app/billing', label: 'Billing', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export const helpNav: NavItem = { to: '/app/help', label: 'Help Center', icon: LifeBuoy };

export const mobileNav: NavItem[] = [
  primaryNav[0]!,
  primaryNav[1]!,
  primaryNav[3]!,
  primaryNav[4]!,
];
