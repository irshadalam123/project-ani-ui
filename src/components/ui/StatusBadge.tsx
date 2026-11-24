import { Badge } from '@/components/ui/Badge';
import type { AutomationStatus } from '@/types/automation';

const labels: Record<AutomationStatus, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};

const tones = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  DRAFT: 'neutral',
  ARCHIVED: 'neutral',
} as const;

export function StatusBadge({ status }: { status: AutomationStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>;
}
