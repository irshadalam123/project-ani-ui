import { baseApi } from '@/api/baseApi';
import { pageParams, unwrapData, unwrapList, type Envelope, type ListEnvelope } from '@/api/helpers';
import type { PageQuery, PageResult } from '@/types/common';
import type { Contact } from '@/types/contact';

const listTag = { type: 'Contacts' as const, id: 'LIST' };

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<PageResult<Contact>, PageQuery | void>({
      query: (query) => ({
        url: '/api/v1/contacts',
        params: pageParams(query ?? {}),
      }),
      transformResponse: (response: ListEnvelope<Contact>) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [...result.items.map((item) => ({ type: 'Contacts' as const, id: item.id })), listTag]
          : [listTag],
    }),
    getContact: builder.query<Contact, string>({
      query: (id) => `/api/v1/contacts/${id}`,
      transformResponse: (response: Envelope<Contact>) => unwrapData(response),
      providesTags: (_result, _error, id) => [{ type: 'Contacts', id }],
    }),
  }),
});

export const { useGetContactsQuery, useGetContactQuery } = contactApi;
