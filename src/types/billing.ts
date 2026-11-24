/**
 * Planned billing contracts.
 * The FastAPI app does not expose these routes yet.
 */

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  price_label: string;
  dm_limit: number;
  dm_used: number;
  renews_at: string | null;
}

export interface BillingPlan {
  id: string;
  name: string;
  price_label: string;
  interval: 'month' | 'year';
  dm_limit: number;
  description: string;
  features: string[];
}

export interface CheckoutRequest {
  plan_id: string;
}

export interface CheckoutResult {
  checkout_url: string;
}

export interface CancelSubscriptionResult {
  canceled: boolean;
}
