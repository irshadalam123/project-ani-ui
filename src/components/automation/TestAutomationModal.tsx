import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { commentMatches } from '@/lib/matcher';
import { renderTemplate } from '@/lib/template';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import type { AutomationAction, AutomationTrigger } from '@/types/automation';

interface TestResult {
  matched: boolean;
  publicReply: string | null;
  privateReply: string | null;
}

export function TestAutomationModal({
  open,
  onClose,
  trigger,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
}) {
  const [comment, setComment] = useState('GUIDE');
  const [username, setUsername] = useState('test_user');
  const [firstName, setFirstName] = useState('Irshad');
  const [result, setResult] = useState<TestResult | null>(null);

  function runTest() {
    const matched = commentMatches(comment, trigger);
    const variables = { first_name: firstName, username };
    const publicAction = actions.find((action) => action.type === 'PUBLIC_REPLY');
    const privateAction = actions.find((action) => action.type === 'PRIVATE_REPLY');
    setResult({
      matched,
      publicReply: matched && publicAction ? renderTemplate(publicAction.text, variables) : null,
      privateReply: matched && privateAction ? renderTemplate(privateAction.text, variables) : null,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Test automation"
      description="This runs locally with the same keyword rules as the backend. There is no test endpoint yet."
    >
      <div className="space-y-3">
        <Input label="Test comment" value={comment} onChange={(event) => setComment(event.target.value)} />
        <Input label="Instagram username" value={username} onChange={(event) => setUsername(event.target.value)} />
        <Input label="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        <Button onClick={runTest}>Run test</Button>
        {result ? (
          <ul className="space-y-2 rounded-xl border border-line bg-surface-muted p-3 text-sm">
            <ResultRow ok={result.matched} label={result.matched ? 'Trigger matched' : 'Trigger did not match'} />
            <ResultRow ok={Boolean(result.publicReply)} label={result.publicReply ? `Public reply: ${result.publicReply}` : 'Public reply skipped'} />
            <ResultRow ok={Boolean(result.privateReply)} label={result.privateReply ? `Private DM: ${result.privateReply}` : 'Private DM skipped'} />
          </ul>
        ) : null}
      </div>
    </Dialog>
  );
}

function ResultRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <CircleCheck className={ok ? 'mt-0.5 size-4 text-success' : 'mt-0.5 size-4 text-faint'} aria-hidden="true" />
      <span>{label}</span>
    </li>
  );
}
