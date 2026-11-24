export type ExecutionStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'SKIPPED';
export type ActionResultStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface ActionResult {
  action_index: number;
  action_type: string;
  status: ActionResultStatus;
  external_id: string | null;
  error: string | null;
  rendered_text: string | null;
}

export interface Execution {
  id: string;
  workspace_id: string;
  instagram_account_id: string;
  automation_id: string;
  webhook_event_id: string;
  comment_id: string;
  status: ExecutionStatus;
  action_results: ActionResult[];
  error: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}
