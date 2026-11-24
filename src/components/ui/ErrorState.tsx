import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ErrorState({
  title = 'Something went wrong.',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center" role="alert">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-danger-soft text-danger">
        <TriangleAlert className="size-5" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {onRetry ? (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
