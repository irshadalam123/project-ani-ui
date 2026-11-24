import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AutomationListPage from '@/features/automations/pages/AutomationListPage';
import { renderWithProviders } from '@/test/render';

describe('automation list', () => {
  it('shows an error state when the API cannot be reached', async () => {
    renderWithProviders(<AutomationListPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
