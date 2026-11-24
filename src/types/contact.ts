export interface Contact {
  id: string;
  workspace_id: string;
  instagram_account_id: string;
  instagram_user_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string>;
}
