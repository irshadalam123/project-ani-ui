import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import type { ActionType } from '@/types/automation';

const AVAILABLE: Array<{ type: ActionType; title: string; description: string }> = [
  {
    type: 'PUBLIC_REPLY',
    title: 'Public reply',
    description: 'Reply under the comment so the person knows to check their DMs.',
  },
  {
    type: 'PRIVATE_REPLY',
    title: 'Private DM',
    description: 'Send a private reply to the commenter.',
  },
];

const COMING_SOON = ['Send link', 'Collect email', 'Collect phone', 'AI reply', 'Wait', 'Condition', 'Add tag'];

export function ActionPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: ActionType) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Add action" description="Choose what happens after a comment matches.">
      <div className="space-y-2">
        {AVAILABLE.map((action) => (
          <button
            key={action.type}
            type="button"
            className="w-full rounded-xl border border-line px-3 py-3 text-left transition hover:border-brand hover:bg-brand-soft/40"
            onClick={() => {
              onSelect(action.type);
              onClose();
            }}
          >
            <span className="block text-sm font-semibold text-ink">{action.title}</span>
            <span className="mt-1 block text-xs text-muted">{action.description}</span>
          </button>
        ))}
        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold tracking-wide text-faint uppercase">Coming soon</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {COMING_SOON.map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="flex items-center justify-between rounded-xl border border-dashed border-line px-3 py-2 text-left text-sm text-faint"
              >
                {label}
                <Badge>Coming soon</Badge>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
