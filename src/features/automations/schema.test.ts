import { describe, expect, it } from 'vitest';
import { automationFormSchema, formToCreateRequest } from '@/features/automations/schema';

describe('automation form', () => {
  it('requires a keyword trigger', () => {
    const result = automationFormSchema.safeParse({
      name: 'Guide',
      description: '',
      instagram_account_id: 'acc-1',
      triggerType: 'COMMENT_KEYWORD',
      matchType: 'CONTAINS',
      keywords: [],
      actions: [{ type: 'PRIVATE_REPLY', text: 'Hello' }],
    });
    expect(result.success).toBe(false);
  });

  it('builds a create payload with a public reply and a private DM', () => {
    const parsed = automationFormSchema.parse({
      name: 'Guide',
      description: 'Send the guide',
      instagram_account_id: 'acc-1',
      triggerType: 'COMMENT_KEYWORD',
      matchType: 'CONTAINS',
      keywords: ['guide'],
      actions: [
        { type: 'PUBLIC_REPLY', text: 'Check your DM' },
        { type: 'PRIVATE_REPLY', text: 'Hey {{first_name}}' },
      ],
    });
    expect(formToCreateRequest(parsed, 'DRAFT')).toEqual({
      name: 'Guide',
      description: 'Send the guide',
      instagram_account_id: 'acc-1',
      status: 'DRAFT',
      trigger: { type: 'COMMENT_KEYWORD', keywords: ['guide'], match_type: 'CONTAINS' },
      actions: [
        { type: 'PUBLIC_REPLY', text: 'Check your DM' },
        { type: 'PRIVATE_REPLY', text: 'Hey {{first_name}}' },
      ],
    });
  });
});
