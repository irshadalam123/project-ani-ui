import { setSession } from '@/store/authSlice';
import { setWorkspace } from '@/store/workspaceSlice';
import type { AppDispatch } from '@/store/store';
import type { AuthSession } from '@/types/auth';

export function applySession(dispatch: AppDispatch, session: AuthSession): void {
  dispatch(setSession({ token: session.access_token, user: session.user }));
  dispatch(setWorkspace(session.workspace));
}

const onboardingKey = (userId: string) => `cmmdm.onboarding.${userId}`;

export function isOnboardingComplete(userId: string): boolean {
  return localStorage.getItem(onboardingKey(userId)) === 'done';
}

export function completeOnboarding(userId: string): void {
  localStorage.setItem(onboardingKey(userId), 'done');
}
