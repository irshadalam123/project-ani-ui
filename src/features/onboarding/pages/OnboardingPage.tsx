import { Check } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLazyGetInstagramConnectLinkQuery } from '@/api/instagramApi';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/toast-context';
import { completeOnboarding } from '@/features/auth/session';
import { parseApiError } from '@/lib/errors';
import { cn } from '@/lib/cn';
import { useAppSelector } from '@/store/hooks';

const steps = ['Welcome', 'Connect Instagram', 'Create automation', 'Test', 'Finish'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const [connect, connectState] = useLazyGetInstagramConnectLinkQuery();

  function finish() {
    if (user) completeOnboarding(user.id);
    navigate('/app/dashboard');
  }

  async function startConnect() {
    try {
      const link = await connect().unwrap();
      window.location.assign(link.authorization_url);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  return (
    <main className="min-h-svh bg-canvas px-4 py-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Logo />
        <Button variant="ghost" onClick={finish}>
          Skip
        </Button>
      </div>
      <ol className="mx-auto mt-8 flex max-w-2xl gap-2" aria-label="Onboarding progress">
        {steps.map((label, index) => (
          <li key={label} className="flex-1">
            <div className={cn('h-1 rounded-full', index <= step ? 'bg-brand' : 'bg-line')} />
            <p className={cn('mt-2 text-[11px] font-medium', index === step ? 'text-ink' : 'text-faint')}>{label}</p>
          </li>
        ))}
      </ol>
      <Card className="mx-auto mt-8 max-w-2xl p-6 sm:p-8">
        {step === 0 ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome{user ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              You will connect an Instagram professional account, write one keyword automation, and preview the DM before it goes live.
            </p>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Connect Instagram</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              We send you to Meta using the authorization URL from the API. Tokens stay on the server.
            </p>
            <Button className="mt-6" loading={connectState.isFetching} onClick={() => void startConnect()}>
              Connect Instagram
            </Button>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Create your first automation</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Pick a keyword such as GUIDE, add a public reply, and write the private DM.
            </p>
            <Link to="/app/automations/new" className="mt-6 inline-block">
              <Button>Open the builder</Button>
            </Link>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Test the keyword</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Use Test automation in the builder. It checks the comment locally with the same matching rules as the engine. A server test endpoint is not available yet.
            </p>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">You are ready</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Activate the automation. When a matching comment arrives, the backend sends the public reply and the private DM.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-success">
              <Check className="size-4" aria-hidden="true" />
              Onboarding can be skipped next time.
            </div>
          </>
        ) : null}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)}>Continue</Button>
          ) : (
            <Button onClick={finish}>Go to dashboard</Button>
          )}
        </div>
      </Card>
    </main>
  );
}
