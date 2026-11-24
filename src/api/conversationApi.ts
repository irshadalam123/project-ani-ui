import { baseApi } from '@/api/baseApi';
import { pageParams, unwrapData, unwrapList, type Envelope, type ListEnvelope } from '@/api/helpers';
import type { PageQuery, PageResult } from '@/types/common';
import type { Conversation, Message } from '@/types/conversation';

const listTag = { type: 'Conversations' as const, id: 'LIST' };

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<PageResult<Conversation>, PageQuery | void>({
      query: (query) => ({
        url: '/api/v1/conversations',
        params: pageParams(query ?? {}),
      }),
      transformResponse: (response: ListEnvelope<Conversation>) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: 'Conversations' as const, id: item.id })),
              listTag,
            ]
          : [listTag],
    }),
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/api/v1/conversations/${id}`,
      transformResponse: (response: Envelope<Conversation>) => unwrapData(response),
      providesTags: (_result, _error, id) => [{ type: 'Conversations', id }],
    }),
    getMessages: builder.query<PageResult<Message>, { conversationId: string } & PageQuery>({
      query: ({ conversationId, ...query }) => ({
        url: `/api/v1/conversations/${conversationId}/messages`,
        params: pageParams(query),
      }),
      transformResponse: (response: ListEnvelope<Message>) => unwrapList(response),
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Conversations', id: `${conversationId}-messages` },
      ],
    }),
  }),
});

export const { useGetConversationsQuery, useGetConversationQuery, useGetMessagesQuery } =
  conversationApi;
