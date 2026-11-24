import { baseApi } from '@/api/baseApi';
import { pageParams, unwrapData, unwrapList, type Envelope, type ListEnvelope } from '@/api/helpers';
import type { PageQuery, PageResult } from '@/types/common';
import type { Execution } from '@/types/execution';

export const executionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExecutions: builder.query<PageResult<Execution>, (PageQuery & { automation_id?: string }) | void>({
      query: (query) => ({
        url: '/api/v1/executions',
        params: {
          ...pageParams(query ?? {}),
          ...(query?.automation_id ? { automation_id: query.automation_id } : {}),
        },
      }),
      transformResponse: (response: ListEnvelope<Execution>) => unwrapList(response),
      providesTags: ['Executions'],
    }),
    getExecution: builder.query<Execution, string>({
      query: (id) => `/api/v1/executions/${id}`,
      transformResponse: (response: Envelope<Execution>) => unwrapData(response),
      providesTags: (_result, _error, id) => [{ type: 'Executions', id }],
    }),
  }),
});

export const { useGetExecutionsQuery, useGetExecutionQuery } = executionApi;
