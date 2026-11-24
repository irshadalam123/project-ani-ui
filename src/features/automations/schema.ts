import { z } from 'zod';
import type { Automation, AutomationAction, AutomationCreateRequest, AutomationTrigger } from '@/types/automation';

export const automationFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    description: z.string().trim().max(2000),
    instagram_account_id: z.string().min(1, 'Choose an Instagram account'),
    triggerType: z.enum(['COMMENT_KEYWORD', 'ANY_COMMENT']),
    matchType: z.enum(['EXACT', 'CONTAINS', 'STARTS_WITH', 'REGEX']),
    keywords: z.array(z.string().trim().min(1)),
    actions: z
      .array(
        z.object({
          type: z.enum(['PUBLIC_REPLY', 'PRIVATE_REPLY']),
          text: z.string().trim().min(1, 'Message is required').max(1000),
        }),
      )
      .min(1, 'Add at least one action'),
  })
  .superRefine((value, context) => {
    if (value.triggerType === 'COMMENT_KEYWORD' && value.keywords.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one keyword',
        path: ['keywords'],
      });
    }
  });

export type AutomationFormValues = z.infer<typeof automationFormSchema>;

export function emptyAutomationForm(accountId = ''): AutomationFormValues {
  return {
    name: '',
    description: '',
    instagram_account_id: accountId,
    triggerType: 'COMMENT_KEYWORD',
    matchType: 'CONTAINS',
    keywords: [],
    actions: [
      { type: 'PUBLIC_REPLY', text: 'Check your DM 🚀' },
      { type: 'PRIVATE_REPLY', text: "Hey {{first_name}}, here's your guide!" },
    ],
  };
}

export function automationToForm(automation: Automation): AutomationFormValues {
  return {
    name: automation.name,
    description: automation.description ?? '',
    instagram_account_id: automation.instagram_account_id,
    triggerType: automation.trigger.type,
    matchType: automation.trigger.type === 'COMMENT_KEYWORD' ? automation.trigger.match_type : 'CONTAINS',
    keywords: automation.trigger.type === 'COMMENT_KEYWORD' ? automation.trigger.keywords : [],
    actions: automation.actions.map((action) => ({ type: action.type, text: action.text })),
  };
}

export function formToTrigger(values: AutomationFormValues): AutomationTrigger {
  if (values.triggerType === 'ANY_COMMENT') return { type: 'ANY_COMMENT' };
  return {
    type: 'COMMENT_KEYWORD',
    keywords: values.keywords,
    match_type: values.matchType,
  };
}

export function formToActions(values: AutomationFormValues): AutomationAction[] {
  return values.actions.map((action) =>
    action.type === 'PUBLIC_REPLY'
      ? { type: 'PUBLIC_REPLY', text: action.text }
      : { type: 'PRIVATE_REPLY', text: action.text },
  );
}

export function formToCreateRequest(
  values: AutomationFormValues,
  status: 'DRAFT' | 'ACTIVE',
): AutomationCreateRequest {
  return {
    name: values.name,
    description: values.description.trim() ? values.description.trim() : null,
    instagram_account_id: values.instagram_account_id,
    status,
    trigger: formToTrigger(values),
    actions: formToActions(values),
  };
}
