import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActionPicker } from '@/components/automation/ActionPicker';

describe('action picker', () => {
  it('creates a public reply and keeps future actions disabled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ActionPicker open onClose={() => undefined} onSelect={onSelect} />);
    expect(screen.getByRole('button', { name: /send link/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /public reply/i }));
    expect(onSelect).toHaveBeenCalledWith('PUBLIC_REPLY');
  });
});
