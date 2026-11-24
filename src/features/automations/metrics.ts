import type { Execution } from '@/types/execution';

export function privateDmCount(executions: Execution[], automationId?: string): number {
  return executions.reduce((total, execution) => {
    if (automationId && execution.automation_id !== automationId) return total;
    return (
      total +
      execution.action_results.filter(
        (result) => result.action_type === 'PRIVATE_REPLY' && result.status === 'SUCCESS',
      ).length
    );
  }, 0);
}

export function failureCount(executions: Execution[], automationId?: string): number {
  return executions.filter((execution) => {
    if (automationId && execution.automation_id !== automationId) return false;
    return execution.status === 'FAILED';
  }).length;
}

export function triggerLabel(trigger: { type: string; keywords?: string[]; match_type?: string }): string {
  if (trigger.type === 'ANY_COMMENT') return 'Any comment';
  const keywords = trigger.keywords?.join(', ') || 'Keyword';
  return `${trigger.match_type ?? 'CONTAINS'}: ${keywords}`;
}
