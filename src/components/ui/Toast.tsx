import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ToastContext, type ToastApi } from '@/components/ui/toast-context';

interface ToastItem {
  id: number;
  message: string;
  tone: 'success' | 'error' | 'info';
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastItem['tone']) => {
    const id = nextId;
    nextId += 1;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-20 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2 md:bottom-4" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-xl border px-3 py-2.5 text-sm shadow-pop',
              toast.tone === 'success' && 'border-success/30 bg-surface text-ink',
              toast.tone === 'error' && 'border-danger/30 bg-surface text-ink',
              toast.tone === 'info' && 'border-line bg-surface text-ink',
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
