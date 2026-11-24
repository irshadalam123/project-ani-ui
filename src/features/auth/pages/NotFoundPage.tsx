import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page is not here</h1>
        <p className="mt-2 text-sm text-muted">The link may be outdated, or the page may have moved.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </main>
  );
}
