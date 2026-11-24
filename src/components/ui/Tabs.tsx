import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-muted p-1">
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition',
              selected ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
