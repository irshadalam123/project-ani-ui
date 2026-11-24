import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AutomationBuilderPage from '@/features/automations/pages/AutomationBuilderPage';
import { renderWithProviders } from '@/test/render';

describe('automation builder', () => {
  it('renders the keyword flow and both reply actions', async () => {
    renderWithProviders(<AutomationBuilderPage />, { route: '/app/automations/new' });
    expect(await screen.findByRole('button', { name: 'Save draft' })).toBeInTheDocument();
    expect(screen.getByLabelText('Keyword')).toBeInTheDocument();
    expect(screen.getByLabelText('Public reply')).toBeInTheDocument();
    expect(screen.getByLabelText('Private DM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add button' })).toBeDisabled();
  });
});
