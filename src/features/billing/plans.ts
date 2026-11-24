import type { BillingPlan } from '@/types/billing';

/** Display catalog used only when GET /api/v1/billing/plans is not available. */
export const plannedPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price_label: '₹0',
    interval: 'month',
    dm_limit: 100,
    description: 'Try comment-to-DM on a single account.',
    features: ['1 Instagram account', '100 DMs / month', 'Keyword triggers'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price_label: '₹499',
    interval: 'month',
    dm_limit: 2000,
    description: 'For creators getting started.',
    features: ['2 Instagram accounts', '2,000 DMs / month', 'Inbox and contacts'],
  },
  {
    id: 'creator',
    name: 'Creator',
    price_label: '₹999',
    interval: 'month',
    dm_limit: 10000,
    description: 'The plan most creators use.',
    features: ['5 Instagram accounts', '10,000 DMs / month', 'Analytics overview'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price_label: '₹2,499',
    interval: 'month',
    dm_limit: 50000,
    description: 'For teams running several accounts.',
    features: ['15 Instagram accounts', '50,000 DMs / month', 'Priority support'],
  },
  {
    id: 'agency',
    name: 'Agency',
    price_label: '₹4,999',
    interval: 'month',
    dm_limit: 200000,
    description: 'For agencies managing client workspaces.',
    features: ['Unlimited accounts', '200,000 DMs / month', 'Shared workspaces'],
  },
];
