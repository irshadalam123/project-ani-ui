import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useActivateAutomationMutation,
  useCreateAutomationMutation,
  useDeleteAutomationMutation,
  usePauseAutomationMutation,
} from '@/api/automationApi';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dropdown } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/toast-context';
import { parseApiError } from '@/lib/errors';
import type { Automation } from '@/types/automation';

export function AutomationMenu({ automation }: { automation: Automation }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activate] = useActivateAutomationMutation();
  const [pause] = usePauseAutomationMutation();
  const [remove, removeState] = useDeleteAutomationMutation();
  const [create] = useCreateAutomationMutation();

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action();
      toast.success(message);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  return (
    <>
      <Dropdown
        label={`${automation.name} actions`}
        trigger={
          <Button variant="ghost" size="icon" aria-label={`Actions for ${automation.name}`}>
            <Ellipsis className="size-4" />
          </Button>
        }
        items={[
          { label: 'Edit', onSelect: () => navigate(`/app/automations/${automation.id}/edit`) },
          automation.status === 'ACTIVE'
            ? { label: 'Pause', onSelect: () => void run(() => pause(automation.id).unwrap(), 'Automation paused') }
            : {
                label: 'Activate',
                onSelect: () => void run(() => activate(automation.id).unwrap(), 'Automation activated'),
              },
          {
            label: 'Duplicate',
            onSelect: () =>
              void run(async () => {
                const copy = await create({
                  name: `${automation.name} (copy)`.slice(0, 200),
                  description: automation.description,
                  instagram_account_id: automation.instagram_account_id,
                  status: 'DRAFT',
                  trigger: automation.trigger,
                  actions: automation.actions,
                }).unwrap();
                navigate(`/app/automations/${copy.id}/edit`);
              }, 'Automation duplicated'),
          },
          {
            label: 'Delete',
            tone: 'danger',
            onSelect: () => setConfirmDelete(true),
          },
        ]}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete automation?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={removeState.isLoading}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          void run(async () => {
            await remove(automation.id).unwrap();
            setConfirmDelete(false);
          }, 'Automation deleted')
        }
      />
    </>
  );
}
