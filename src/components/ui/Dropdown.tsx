import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DropdownItem {
  label: string;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

export function Dropdown({
  label,
  trigger,
  items,
  align = 'right',
}: {
  label: string;
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <div
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') setOpen(true);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        {trigger}
      </div>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute z-30 mt-2 min-w-44 rounded-xl border border-line bg-surface p-1 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cn(
                'flex w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50',
                item.tone === 'danger' ? 'text-danger' : 'text-ink',
              )}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
