import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/api/authApi';
import { LogoMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { appName } from '@/config';
import { AuthShowcase } from '@/features/auth/pages/AuthShowcase';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { applySession } from '@/features/auth/session';
import { parseApiError } from '@/lib/errors';
import { useAppDispatch } from '@/store/hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [login, loginState] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      const session = await login(values).unwrap();
      applySession(dispatch, session);
      toast.success('Signed in');
      console.log('login', values);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('error', error);
      setFormError(parseApiError(error));
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthShowcase />
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark />
            <span className="font-semibold">{appName}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Welcome back. Pick up your automations where you left them.
          </p>
          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {formError ? (
              <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
                {formError}
              </p>
            ) : null}
            <Button type="submit" className="w-full" loading={loginState.isLoading}>
              Sign in
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled>
              Continue with Google
            </Button>
            <p className="text-center text-xs text-faint">Google sign-in is not available yet.</p>
          </form>
          <p className="mt-6 text-sm text-muted">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
