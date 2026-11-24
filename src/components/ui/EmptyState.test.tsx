import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('shows the title, description, and action', () => {
    render(
      <EmptyState
        title="No automations"
        description="Create your first automation and turn Instagram comments into conversations."
        action={<button type="button">Create automation</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No automations' })).toBeInTheDocument();
    expect(screen.getByText(/turn Instagram comments into conversations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create automation' })).toBeInTheDocument();
  });
});
