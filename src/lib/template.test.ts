import { describe, expect, it } from 'vitest';
import { renderTemplate } from '@/lib/template';

describe('renderTemplate', () => {
  it('replaces known variables', () => {
    expect(renderTemplate('Hey {{first_name}} 👋', { first_name: 'Irshad', username: 'test_user' })).toBe(
      'Hey Irshad 👋',
    );
  });

  it('leaves unknown placeholders in place', () => {
    expect(renderTemplate('Hi {{nickname}}', { first_name: 'Irshad' })).toBe('Hi {{nickname}}');
  });
});
