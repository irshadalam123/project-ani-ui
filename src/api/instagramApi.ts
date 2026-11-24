import { baseApi } from '@/api/baseApi';
import { unwrapData, type Envelope } from '@/api/helpers';
import type { DeletedData } from '@/types/common';
import type { InstagramAccount, InstagramConnectLink } from '@/types/instagram';

export const instagramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstagramAccounts: builder.query<InstagramAccount[], void>({
      query: () => '/api/v1/instagram/accounts',
      transformResponse: (response: Envelope<InstagramAccount[]>) => unwrapData(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((account) => ({ type: 'Instagram' as const, id: account.id })),
              { type: 'Instagram' as const, id: 'LIST' },
            ]
          : [{ type: 'Instagram' as const, id: 'LIST' }],
    }),
    getInstagramConnectLink: builder.query<InstagramConnectLink, void>({
      query: () => '/api/v1/instagram/connect',
      transformResponse: (response: Envelope<InstagramConnectLink>) => unwrapData(response),
    }),
    disconnectInstagramAccount: builder.mutation<DeletedData, string>({
      query: (accountId) => ({
        url: `/api/v1/instagram/accounts/${accountId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: Envelope<DeletedData>) => unwrapData(response),
      invalidatesTags: [{ type: 'Instagram', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetInstagramAccountsQuery,
  useLazyGetInstagramConnectLinkQuery,
  useDisconnectInstagramAccountMutation,
} = instagramApi;
