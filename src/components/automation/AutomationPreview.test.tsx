import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AutomationPreview } from '@/components/automation/AutomationPreview';

describe('automation preview', () => {
  it('renders the private DM with the sample first name', () => {
    render(
      <AutomationPreview
        keyword="GUIDE"
        username="test_user"
        firstName="Irshad"
        actions={[
          { type: 'PUBLIC_REPLY', text: 'Check your DM 🚀' },
          { type: 'PRIVATE_REPLY', text: 'Hey {{first_name}} 👋' },
        ]}
      />,
    );
    expect(screen.getByText('GUIDE')).toBeInTheDocument();
    expect(screen.getByText('Hey Irshad 👋')).toBeInTheDocument();
    expect(screen.getByText('Check your DM 🚀')).toBeInTheDocument();
  });
});
