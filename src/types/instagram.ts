export interface InstagramAccount {
  id: string;
  workspace_id: string;
  instagram_user_id: string;
  username: string;
  name: string | null;
  account_type: string | null;
  profile_picture_url: string | null;
  webhook_subscribed: boolean;
  scopes: string[];
  connected_at: string;
  created_at: string;
  updated_at: string;
}

export interface InstagramConnectLink {
  authorization_url: string;
  state: string;
}
