import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('exposes its label and a loading state', () => {
    render(<Button loading>Save draft</Button>);
    const button = screen.getByRole('button', { name: 'Save draft' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
