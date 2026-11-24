export const AUTOMATION_STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const;
export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

export const MATCH_TYPES = ['EXACT', 'CONTAINS', 'STARTS_WITH', 'REGEX'] as const;
export type MatchType = (typeof MATCH_TYPES)[number];

export const TRIGGER_TYPES = ['COMMENT_KEYWORD', 'ANY_COMMENT'] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const ACTION_TYPES = ['PUBLIC_REPLY', 'PRIVATE_REPLY'] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export interface KeywordTrigger {
  type: 'COMMENT_KEYWORD';
  keywords: string[];
  match_type: MatchType;
}

export interface AnyCommentTrigger {
  type: 'ANY_COMMENT';
}

export type AutomationTrigger = KeywordTrigger | AnyCommentTrigger;

export interface PublicReplyAction {
  type: 'PUBLIC_REPLY';
  text: string;
}

export interface PrivateReplyAction {
  type: 'PRIVATE_REPLY';
  text: string;
}

export type AutomationAction = PublicReplyAction | PrivateReplyAction;

export interface Automation {
  id: string;
  workspace_id: string;
  instagram_account_id: string;
  name: string;
  description: string | null;
  status: AutomationStatus;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  created_at: string;
  updated_at: string;
}

export interface AutomationCreateRequest {
  name: string;
  description: string | null;
  instagram_account_id: string;
  status: AutomationStatus;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
}

export interface AutomationUpdateRequest {
  name?: string;
  description?: string | null;
  instagram_account_id?: string;
  trigger?: AutomationTrigger;
  actions?: AutomationAction[];
}
