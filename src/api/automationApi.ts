import { baseApi } from '@/api/baseApi';
import { pageParams, unwrapData, unwrapList, type Envelope, type ListEnvelope } from '@/api/helpers';
import type { PageQuery, PageResult } from '@/types/common';
import type {
  Automation,
  AutomationCreateRequest,
  AutomationUpdateRequest,
} from '@/types/automation';

const listTag = { type: 'Automations' as const, id: 'LIST' };

export const automationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAutomations: builder.query<PageResult<Automation>, PageQuery | void>({
      query: (query) => ({
        url: '/api/v1/automations',
        params: pageParams(query ?? {}),
      }),
      transformResponse: (response: ListEnvelope<Automation>) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [...result.items.map((item) => ({ type: 'Automations' as const, id: item.id })), listTag]
          : [listTag],
    }),
    getAutomation: builder.query<Automation, string>({
      query: (id) => `/api/v1/automations/${id}`,
      transformResponse: (response: Envelope<Automation>) => unwrapData(response),
      providesTags: (_result, _error, id) => [{ type: 'Automations', id }],
    }),
    createAutomation: builder.mutation<Automation, AutomationCreateRequest>({
      query: (body) => ({ url: '/api/v1/automations', method: 'POST', body }),
      transformResponse: (response: Envelope<Automation>) => unwrapData(response),
      invalidatesTags: [listTag],
    }),
    updateAutomation: builder.mutation<Automation, { id: string; body: AutomationUpdateRequest }>({
      query: ({ id, body }) => ({ url: `/api/v1/automations/${id}`, method: 'PATCH', body }),
      transformResponse: (response: Envelope<Automation>) => unwrapData(response),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Automations', id }, listTag],
    }),
    deleteAutomation: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/v1/automations/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag],
    }),
    activateAutomation: builder.mutation<Automation, string>({
      query: (id) => ({ url: `/api/v1/automations/${id}/activate`, method: 'POST' }),
      transformResponse: (response: Envelope<Automation>) => unwrapData(response),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Automations', id },
        listTag,
        'Analytics',
      ],
    }),
    pauseAutomation: builder.mutation<Automation, string>({
      query: (id) => ({ url: `/api/v1/automations/${id}/pause`, method: 'POST' }),
      transformResponse: (response: Envelope<Automation>) => unwrapData(response),
      invalidatesTags: (_result, _error, id) => [{ type: 'Automations', id }, listTag],
    }),
  }),
});

export const {
  useGetAutomationsQuery,
  useGetAutomationQuery,
  useCreateAutomationMutation,
  useUpdateAutomationMutation,
  useDeleteAutomationMutation,
  useActivateAutomationMutation,
  usePauseAutomationMutation,
} = automationApi;
