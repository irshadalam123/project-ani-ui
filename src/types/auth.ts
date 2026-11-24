export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  workspace: Workspace;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  workspace_name?: string;
}

export interface WorkspaceCreateRequest {
  name: string;
}
