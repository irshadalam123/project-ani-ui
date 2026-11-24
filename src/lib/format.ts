export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function conversionRate(comments: number, dms: number): number {
  if (comments <= 0) return 0;
  return (dms / comments) * 100;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (Math.abs(minutes) < 1) return 'Just now';
  if (Math.abs(minutes) < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function firstName(fullName: string): string {
  const [name] = fullName.trim().split(/\s+/);
  return name || 'there';
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return '?';
  if (!second) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

export function contactLabel(contact: {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
}): string {
  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ');
  if (name) return name;
  if (contact.username) return `@${contact.username}`;
  return 'Instagram contact';
}
