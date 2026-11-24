import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import { renderWithProviders } from '@/test/render';

describe('register form', () => {
  it('requires matching passwords', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByLabelText('Full name'), 'Avery Owner');
    await user.type(screen.getByLabelText('Email'), 'avery@example.com');
    await user.type(screen.getByLabelText('Password'), 'longpassword');
    await user.type(screen.getByLabelText('Confirm password'), 'different');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('requires a password of at least 8 characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByLabelText('Full name'), 'Avery Owner');
    await user.type(screen.getByLabelText('Email'), 'avery@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.type(screen.getByLabelText('Confirm password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Use at least 8 characters')).toBeInTheDocument();
  });
});
