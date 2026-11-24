import { useState } from 'react';
import {
  useCancelSubscriptionMutation,
  useCreateCheckoutMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
} from '@/api/billingApi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { PendingNote } from '@/components/ui/PendingNote';
import { Progress } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/toast-context';
import { plannedPlans } from '@/features/billing/plans';
import { formatNumber } from '@/lib/format';
import { isNotFoundError, parseApiError } from '@/lib/errors';
import { cn } from '@/lib/cn';

export default function BillingPage() {
  const subscription = useGetSubscriptionQuery();
  const plans = useGetPlansQuery();
  const [checkout, checkoutState] = useCreateCheckoutMutation();
  const [cancel, cancelState] = useCancelSubscriptionMutation();
  const [cancelOpen, setCancelOpen] = useState(false);
  const toast = useToast();
  const catalog = plans.data ?? plannedPlans;
  const usingPlannedCatalog = !plans.data;
  const missingSubscription = subscription.isError && isNotFoundError(subscription.error);

  async function startCheckout(planId: string) {
    try {
      const result = await checkout({ plan_id: planId }).unwrap();
      if (result.checkout_url) window.location.assign(result.checkout_url);
    } catch (error) {
      if (isNotFoundError(error)) {
        toast.info('Billing checkout is not available yet.');
        return;
      }
      toast.error(parseApiError(error));
    }
  }

  async function confirmCancel() {
    try {
      await cancel().unwrap();
      toast.success('Subscription canceled');
      setCancelOpen(false);
    } catch (error) {
      if (isNotFoundError(error)) {
        toast.info('Canceling a subscription is not available yet.');
        setCancelOpen(false);
        return;
      }
      toast.error(parseApiError(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader description="Plan, usage, and checkout go through the billing API." />
      <PendingNote>
        Billing routes are not on the API yet. Prices below are a planned catalog, not a live subscription.
      </PendingNote>
      <Card className="p-5">
        {subscription.isLoading ? (
          <p className="text-sm text-muted">Checking subscription…</p>
        ) : subscription.data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Current plan</p>
                <h2 className="text-2xl font-semibold">{subscription.data.plan_name}</h2>
                <p className="text-sm text-muted">{subscription.data.price_label}</p>
              </div>
              <Badge tone="brand">{subscription.data.status}</Badge>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Usage</span>
                <span>
                  {formatNumber(subscription.data.dm_used)} / {formatNumber(subscription.data.dm_limit)}
                </span>
              </div>
              <Progress value={subscription.data.dm_used} max={subscription.data.dm_limit} label="DM usage" />
            </div>
            <Button variant="outline" onClick={() => setCancelOpen(true)}>
              Cancel subscription
            </Button>
          </div>
        ) : missingSubscription || subscription.isError ? (
          <div>
            <h2 className="text-lg font-semibold">No subscription on file</h2>
            <p className="mt-1 text-sm text-muted">
              {missingSubscription
                ? 'GET /api/v1/billing/subscription is not implemented yet.'
                : parseApiError(subscription.error)}
            </p>
          </div>
        ) : (
          <ErrorState title="Could not load billing" onRetry={() => void subscription.refetch()} />
        )}
      </Card>
      {plans.isError && !isNotFoundError(plans.error) ? (
        <ErrorState description={parseApiError(plans.error)} onRetry={() => void plans.refetch()} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((plan) => (
            <Card key={plan.id} className={cn('flex flex-col p-5', plan.id === 'creator' ? 'border-brand' : '')}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.id === 'creator' ? <Badge tone="brand">Popular</Badge> : null}
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {plan.price_label}
                <span className="text-sm font-medium text-muted">/{plan.interval}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{formatNumber(plan.dm_limit)} DMs/month</p>
              <p className="mt-3 text-sm text-muted">{plan.description}</p>
              <ul className="mt-4 flex-1 space-y-1 text-sm text-ink">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button className="mt-5" variant={plan.id === 'creator' ? 'primary' : 'outline'} loading={checkoutState.isLoading} onClick={() => void startCheckout(plan.id)}>
                {usingPlannedCatalog ? 'Choose plan' : 'Continue to checkout'}
              </Button>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel subscription?"
        description="This action cannot be undone."
        confirmLabel="Cancel subscription"
        loading={cancelState.isLoading}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => void confirmCancel()}
      />
    </div>
  );
}
