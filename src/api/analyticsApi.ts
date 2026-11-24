import { baseApi } from '@/api/baseApi';
import { unwrapData, type Envelope } from '@/api/helpers';
import type { AnalyticsOverview, AnalyticsTimeseries } from '@/types/analytics';

/**
 * Time-series analytics are not implemented by the API.
 * `getAnalyticsTimeseries` is a typed placeholder and is not called by the UI.
 */
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query<AnalyticsOverview, void>({
      query: () => '/api/v1/analytics/overview',
      transformResponse: (response: Envelope<AnalyticsOverview>) => unwrapData(response),
      providesTags: ['Analytics'],
    }),
    getAnalyticsTimeseries: builder.query<AnalyticsTimeseries, '7d' | '30d' | '90d'>({
      query: (range) => ({
        url: '/api/v1/analytics/timeseries',
        params: { range },
      }),
      transformResponse: (response: Envelope<AnalyticsTimeseries>) => unwrapData(response),
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsOverviewQuery } = analyticsApi;
