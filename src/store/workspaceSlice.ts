import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { isRecord, readJson, removeKey, writeJson } from '@/lib/storage';
import type { Workspace } from '@/types/auth';

const WORKSPACE_KEY = 'cmmdm.workspace';

export interface WorkspaceState {
  selectedWorkspaceId: string | null;
  workspace: Workspace | null;
  selectedInstagramAccountId: string | null;
}

function isWorkspace(value: unknown): value is Workspace {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.owner_id === 'string' &&
    typeof value.created_at === 'string' &&
    typeof value.updated_at === 'string'
  );
}

function loadWorkspace(): WorkspaceState {
  const parsed = readJson(WORKSPACE_KEY);
  if (!isRecord(parsed) || !isWorkspace(parsed.workspace)) {
    return { selectedWorkspaceId: null, workspace: null, selectedInstagramAccountId: null };
  }
  return {
    workspace: parsed.workspace,
    selectedWorkspaceId: parsed.workspace.id,
    selectedInstagramAccountId:
      typeof parsed.selectedInstagramAccountId === 'string' ? parsed.selectedInstagramAccountId : null,
  };
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: loadWorkspace(),
  reducers: {
    setWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspace = action.payload;
      state.selectedWorkspaceId = action.payload.id;
    },
    setSelectedInstagramAccountId(state, action: PayloadAction<string | null>) {
      state.selectedInstagramAccountId = action.payload;
    },
    clearWorkspace(state) {
      state.workspace = null;
      state.selectedWorkspaceId = null;
      state.selectedInstagramAccountId = null;
    },
  },
});

export const { setWorkspace, setSelectedInstagramAccountId, clearWorkspace } = workspaceSlice.actions;
export const workspaceReducer = workspaceSlice.reducer;

export function persistWorkspace(state: WorkspaceState): void {
  if (!state.workspace) {
    removeKey(WORKSPACE_KEY);
    return;
  }
  writeJson(WORKSPACE_KEY, {
    workspace: state.workspace,
    selectedInstagramAccountId: state.selectedInstagramAccountId,
  });
}
