import { baseApi } from '@/api/baseApi';
import { unwrapData, type Envelope } from '@/api/helpers';
import type {
  BillingPlan,
  CancelSubscriptionResult,
  CheckoutRequest,
  CheckoutResult,
  Subscription,
} from '@/types/billing';

/**
 * Pending backend implementation.
 * None of these routes exist on the FastAPI app yet. The UI treats 404 as
 * "billing is not available" and does not invent a subscription.
 */
export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<Subscription, void>({
      query: () => '/api/v1/billing/subscription',
      transformResponse: (response: Envelope<Subscription>) => unwrapData(response),
      providesTags: ['Billing'],
    }),
    getPlans: builder.query<BillingPlan[], void>({
      query: () => '/api/v1/billing/plans',
      transformResponse: (response: Envelope<BillingPlan[]>) => unwrapData(response),
      providesTags: ['Billing'],
    }),
    createCheckout: builder.mutation<CheckoutResult, CheckoutRequest>({
      query: (body) => ({ url: '/api/v1/billing/checkout', method: 'POST', body }),
      transformResponse: (response: Envelope<CheckoutResult>) => unwrapData(response),
      invalidatesTags: ['Billing'],
    }),
    cancelSubscription: builder.mutation<CancelSubscriptionResult, void>({
      query: () => ({ url: '/api/v1/billing/cancel', method: 'POST' }),
      transformResponse: (response: Envelope<CancelSubscriptionResult>) => unwrapData(response),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetPlansQuery,
  useCreateCheckoutMutation,
  useCancelSubscriptionMutation,
} = billingApi;
