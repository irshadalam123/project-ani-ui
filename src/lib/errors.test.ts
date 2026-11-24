import { describe, expect, it } from 'vitest';
import { parseApiError } from '@/lib/errors';

describe('parseApiError', () => {
  it('uses a friendly message for rate limits and server errors', () => {
    expect(parseApiError({ status: 429, data: { error: { message: 'slow down' } } })).toBe(
      'Too many requests. Please try again shortly.',
    );
    expect(parseApiError({ status: 500, data: { error: { message: 'trace' } } })).toBe(
      'Something went wrong on our side. Please try again.',
    );
  });

  it('shows the API message for validation errors', () => {
    expect(
      parseApiError({
        status: 422,
        data: { success: false, error: { code: 'VALIDATION_ERROR', message: 'Request validation failed' } },
      }),
    ).toBe('Request validation failed');
  });

  it('explains a network failure', () => {
    expect(parseApiError({ status: 'FETCH_ERROR', error: 'failed' })).toMatch(/couldn't reach the server/i);
  });
});
