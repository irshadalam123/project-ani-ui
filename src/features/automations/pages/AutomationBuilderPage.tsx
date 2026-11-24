import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useActivateAutomationMutation,
  useCreateAutomationMutation,
  useGetAutomationQuery,
  useUpdateAutomationMutation,
} from '@/api/automationApi';
import { useGetInstagramAccountsQuery } from '@/api/instagramApi';
import { ActionCard } from '@/components/automation/ActionCard';
import { ActionPicker } from '@/components/automation/ActionPicker';
import { AutomationPreview } from '@/components/automation/AutomationPreview';
import { TestAutomationModal } from '@/components/automation/TestAutomationModal';
import { TriggerCard } from '@/components/automation/TriggerCard';
import { VariablePicker } from '@/components/automation/VariablePicker';
import { WorkflowStep } from '@/components/automation/WorkflowStep';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/toast-context';
import {
  automationFormSchema,
  automationToForm,
  emptyAutomationForm,
  formToActions,
  formToCreateRequest,
  formToTrigger,
  type AutomationFormValues,
} from '@/features/automations/schema';
import { PREVIEW_VARIABLES } from '@/lib/template';
import { parseApiError } from '@/lib/errors';
import { useAppSelector } from '@/store/hooks';
import type { ActionType } from '@/types/automation';

export default function AutomationBuilderPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const selectedAccountId = useAppSelector((state) => state.workspace.selectedInstagramAccountId);
  const accounts = useGetInstagramAccountsQuery();
  const existing = useGetAutomationQuery(id ?? '', { skip: !id });
  const [createAutomation, createState] = useCreateAutomationMutation();
  const [updateAutomation, updateState] = useUpdateAutomationMutation();
  const [activateAutomation, activateState] = useActivateAutomationMutation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [keywordDraft, setKeywordDraft] = useState('');

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: emptyAutomationForm(selectedAccountId ?? ''),
  });
  const actions = useFieldArray({ control: form.control, name: 'actions' });
  const values = useWatch({ control: form.control });

  useEffect(() => {
    if (existing.data) form.reset(automationToForm(existing.data));
  }, [existing.data, form]);

  useEffect(() => {
    if (isEdit || form.getValues('instagram_account_id')) return;
    const fallback = selectedAccountId || accounts.data?.[0]?.id;
    if (fallback) form.setValue('instagram_account_id', fallback);
  }, [accounts.data, form, isEdit, selectedAccountId]);

  const saving = createState.isLoading || updateState.isLoading || activateState.isLoading;
  const keywords = values.keywords ?? [];
  const previewActions = (values.actions ?? []).map((action) =>
    action.type === 'PUBLIC_REPLY'
      ? { type: 'PUBLIC_REPLY' as const, text: action.text ?? '' }
      : { type: 'PRIVATE_REPLY' as const, text: action.text ?? '' },
  );

  function addKeyword() {
    const next = keywordDraft.trim();
    if (!next) return;
    if (!keywords.includes(next)) form.setValue('keywords', [...keywords, next], { shouldValidate: true });
    setKeywordDraft('');
  }

  function insertVariable(index: number, token: string) {
    const current = form.getValues(`actions.${index}.text`);
    const spacer = current.length > 0 && !current.endsWith(' ') ? ' ' : '';
    form.setValue(`actions.${index}.text`, `${current}${spacer}${token}`, { shouldDirty: true, shouldValidate: true });
  }

  async function persist(mode: 'draft' | 'activate') {
    const valid = await form.trigger();
    if (!valid) return;
    const payload = form.getValues();
    try {
      const saved =
        isEdit && id
          ? await updateAutomation({
              id,
              body: {
                name: payload.name,
                description: payload.description.trim() ? payload.description.trim() : null,
                instagram_account_id: payload.instagram_account_id,
                trigger: formToTrigger(payload),
                actions: formToActions(payload),
              },
            }).unwrap()
          : await createAutomation(formToCreateRequest(payload, 'DRAFT')).unwrap();
      if (mode === 'activate') {
        await activateAutomation(saved.id).unwrap();
        toast.success('Automation activated');
      } else {
        toast.success(isEdit ? 'Automation updated' : 'Automation created');
      }
      navigate(`/app/automations/${saved.id}`);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  if (isEdit && existing.isLoading) {
    return <p className="text-sm text-muted">Loading automation…</p>;
  }
  if (isEdit && existing.isError) {
    return <ErrorState description={parseApiError(existing.error)} onRetry={() => void existing.refetch()} />;
  }

  const preview = (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Live preview</h2>
      <AutomationPreview
        keyword={keywords[0] ?? 'GUIDE'}
        username={PREVIEW_VARIABLES.username}
        firstName={PREVIEW_VARIABLES.first_name}
        actions={previewActions}
      />
      <p className="text-xs text-faint">Preview uses Irshad and @test_user. Unknown placeholders stay as written.</p>
    </div>
  );

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{isEdit ? 'Edit the flow, then save or activate it.' : 'Build a comment-to-DM flow.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setTestOpen(true)}>
            Test automation
          </Button>
          <Button variant="outline" loading={saving} onClick={() => void persist('draft')}>
            Save draft
          </Button>
          <Button loading={saving} onClick={() => void persist('activate')}>
            Activate
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <Card className="order-2 space-y-4 p-4 lg:order-1">
          <h2 className="text-sm font-semibold">Configuration</h2>
          <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <Textarea label="Description" {...form.register('description')} />
          <Select
            label="Instagram account"
            error={form.formState.errors.instagram_account_id?.message}
            {...form.register('instagram_account_id')}
          >
            <option value="">Select an account</option>
            {accounts.data?.map((account) => (
              <option key={account.id} value={account.id}>
                @{account.username}
              </option>
            ))}
          </Select>
          {accounts.data && accounts.data.length === 0 ? (
            <p className="text-xs text-warning">Connect an Instagram account before this automation can run.</p>
          ) : null}
          <Select label="Match type" {...form.register('matchType')}>
            <option value="CONTAINS">Contains keyword</option>
            <option value="EXACT">Exact comment</option>
            <option value="STARTS_WITH">Starts with</option>
            <option value="REGEX">Regular expression</option>
          </Select>
        </Card>

        <div className="order-1 space-y-2 lg:order-2">
          <WorkflowStep label="When">
            <TriggerCard>
              <Select label="On" disabled defaultValue="all">
                <option value="all">All posts and reels</option>
              </Select>
              <p className="text-xs text-faint">Choosing a specific post is not supported by the API yet.</p>
              <Select label="Trigger" {...form.register('triggerType')}>
                <option value="COMMENT_KEYWORD">Keyword</option>
                <option value="ANY_COMMENT">Any comment</option>
              </Select>
              {values.triggerType !== 'ANY_COMMENT' ? (
                <div>
                  <div className="flex gap-2">
                    <Input
                      label="Keyword"
                      value={keywordDraft}
                      placeholder="guide"
                      onChange={(event) => setKeywordDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                          event.preventDefault();
                          addKeyword();
                        }
                      }}
                    />
                    <Button className="mt-7" variant="secondary" onClick={addKeyword}>
                      Add
                    </Button>
                  </div>
                  {form.formState.errors.keywords?.message ? (
                    <p className="mt-1 text-xs text-danger">{form.formState.errors.keywords.message}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
                        onClick={() =>
                          form.setValue(
                            'keywords',
                            keywords.filter((item) => item !== keyword),
                            { shouldValidate: true },
                          )
                        }
                      >
                        {keyword} ×
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">Every top-level comment will match.</p>
              )}
            </TriggerCard>
          </WorkflowStep>

          {actions.fields.map((field, index) => (
            <WorkflowStep key={field.id} label="Then">
              <ActionCard
                type={field.type}
                onRemove={actions.fields.length > 1 ? () => actions.remove(index) : undefined}
              >
                <Textarea
                  label={field.type === 'PUBLIC_REPLY' ? 'Public reply' : 'Private DM'}
                  error={form.formState.errors.actions?.[index]?.text?.message}
                  {...form.register(`actions.${index}.text`)}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <VariablePicker onInsert={(token) => insertVariable(index, token)} />
                  {field.type === 'PRIVATE_REPLY' ? (
                    <Button variant="outline" size="sm" disabled>
                      Add button
                    </Button>
                  ) : null}
                </div>
                {field.type === 'PRIVATE_REPLY' ? (
                  <p className="text-xs text-faint">Buttons are coming soon. The API only stores reply text.</p>
                ) : null}
              </ActionCard>
            </WorkflowStep>
          ))}

          {form.formState.errors.actions?.message ? (
            <p className="text-sm text-danger">{form.formState.errors.actions.message}</p>
          ) : null}
          <Button variant="secondary" onClick={() => setPickerOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add action
          </Button>
        </div>

        <aside className="order-3 hidden xl:block">{preview}</aside>
      </div>

      <Button
        className="fixed right-4 bottom-20 z-20 shadow-pop xl:hidden md:bottom-6"
        onClick={() => setPreviewOpen(true)}
      >
        <Eye className="size-4" aria-hidden="true" />
        Preview
      </Button>

      {previewOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close preview" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-auto rounded-t-3xl bg-surface p-4 shadow-pop md:inset-y-0 md:left-auto md:w-[380px] md:rounded-none">
            {preview}
            <Button className="mt-4 w-full" variant="outline" onClick={() => setPreviewOpen(false)}>
              Close preview
            </Button>
          </div>
        </div>
      ) : null}

      <ActionPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(type: ActionType) =>
          actions.append({
            type,
            text: type === 'PUBLIC_REPLY' ? 'Check your DM 🚀' : 'Hey {{first_name}} 👋',
          })
        }
      />
      <TestAutomationModal
        open={testOpen}
        onClose={() => setTestOpen(false)}
        trigger={formToTrigger({
          ...emptyAutomationForm(),
          ...values,
          name: values.name ?? '',
          description: values.description ?? '',
          instagram_account_id: values.instagram_account_id ?? '',
          triggerType: values.triggerType ?? 'COMMENT_KEYWORD',
          matchType: values.matchType ?? 'CONTAINS',
          keywords,
          actions: previewActions,
        })}
        actions={previewActions}
      />
    </form>
  );
}
