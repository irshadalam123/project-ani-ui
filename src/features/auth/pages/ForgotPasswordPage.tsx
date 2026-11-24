import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-svh place-items-center px-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">
          Password reset is not available yet. The API does not expose a recovery endpoint.
        </p>
        <Link to="/login" className="mt-6 inline-block">
          <Button>Back to sign in</Button>
        </Link>
      </Card>
    </main>
  );
}
