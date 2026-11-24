import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/api/authApi';
import { LogoMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { appName } from '@/config';
import { AuthShowcase } from '@/features/auth/pages/AuthShowcase';
import { registerSchema, type RegisterValues } from '@/features/auth/schemas';
import { applySession } from '@/features/auth/session';
import { parseApiError } from '@/lib/errors';
import { useAppDispatch } from '@/store/hooks';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [registerUser, registerState] = useRegisterMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      workspace_name: '',
    },
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    try {
      const session = await registerUser({
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        workspace_name: values.workspace_name?.trim() ? values.workspace_name.trim() : undefined,
      }).unwrap();
      applySession(dispatch, session);
      toast.success('Account created');
      navigate('/app/onboarding');
    } catch (error) {
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
          <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Start with a workspace, then connect Instagram.</p>
          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Input label="Full name" autoComplete="name" error={form.formState.errors.full_name?.message} {...form.register('full_name')} />
            <Input label="Email" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register('email')} />
            <Input
              label="Workspace name"
              hint="Optional. We use your name if you leave this blank."
              {...form.register('workspace_name')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={form.formState.errors.confirm_password?.message}
              {...form.register('confirm_password')}
            />
            {formError ? (
              <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
                {formError}
              </p>
            ) : null}
            <Button type="submit" className="w-full" loading={registerState.isLoading}>
              Create account
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
