import { baseApi } from '@/api/baseApi';
import { unwrapData, type Envelope } from '@/api/helpers';
import type { Workspace, WorkspaceCreateRequest } from '@/types/auth';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => '/api/v1/workspaces',
      transformResponse: (response: Envelope<Workspace[]>) => unwrapData(response),
      providesTags: ['Workspaces'],
    }),
    createWorkspace: builder.mutation<Workspace, WorkspaceCreateRequest>({
      query: (body) => ({ url: '/api/v1/workspaces', method: 'POST', body }),
      transformResponse: (response: Envelope<Workspace>) => unwrapData(response),
      invalidatesTags: ['Workspaces'],
    }),
  }),
});

export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } = workspaceApi;
