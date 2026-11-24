import { Braces } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

const VARIABLES = [
  { label: 'First name', token: '{{first_name}}' },
  { label: 'Username', token: '{{username}}' },
];

export function VariablePicker({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <Dropdown
      label="Insert variable"
      align="left"
      trigger={
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-muted hover:bg-surface-muted hover:text-ink"
        >
          <Braces className="size-3.5" aria-hidden="true" />
          Insert variable
        </button>
      }
      items={VARIABLES.map((item) => ({
        label: item.label,
        onSelect: () => onInsert(item.token),
      }))}
    />
  );
}
