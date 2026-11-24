import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export function TriggerCard({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-brand-soft/60 px-4 py-3">
        <MessageCircle className="size-4 text-brand" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-ink">Instagram comment</h3>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </Card>
  );
}
