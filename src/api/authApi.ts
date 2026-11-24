import { baseApi } from '@/api/baseApi';
import { unwrapData, type Envelope } from '@/api/helpers';
import type { AuthSession, LoginRequest, RegisterRequest, User } from '@/types/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, LoginRequest>({
      query: (body) => ({ url: '/api/v1/auth/login', method: 'POST', body }),
      transformResponse: (response: Envelope<AuthSession>) => unwrapData(response),
    }),
    register: builder.mutation<AuthSession, RegisterRequest>({
      query: (body) => ({ url: '/api/v1/auth/register', method: 'POST', body }),
      transformResponse: (response: Envelope<AuthSession>) => unwrapData(response),
    }),
    me: builder.query<User, void>({
      query: () => '/api/v1/auth/me',
      transformResponse: (response: Envelope<User>) => unwrapData(response),
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
