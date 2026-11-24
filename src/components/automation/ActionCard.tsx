import { MessageSquare, Reply } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import type { ActionType } from '@/types/automation';

const meta: Record<ActionType, { title: string; icon: typeof Reply }> = {
  PUBLIC_REPLY: { title: 'Public reply', icon: Reply },
  PRIVATE_REPLY: { title: 'Private DM', icon: MessageSquare },
};

export function ActionCard({ type, children, onRemove }: { type: ActionType; children: ReactNode; onRemove?: () => void }) {
  const Icon = meta[type].icon;
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-violet" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-ink">{meta[type].title}</h3>
        </div>
        {onRemove ? (
          <button type="button" className="text-xs font-medium text-muted hover:text-danger" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </Card>
  );
}
