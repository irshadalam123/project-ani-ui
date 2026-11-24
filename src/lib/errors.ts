import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiErrorBody } from '@/types/common';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isRecord(error) && 'status' in error;
}

function readErrorBody(data: unknown): ApiErrorBody | null {
  if (!isRecord(data) || !isRecord(data.error)) return null;
  const body = data.error;
  if (typeof body.message !== 'string') return null;
  return {
    code: typeof body.code === 'string' ? body.code : 'UNKNOWN',
    message: body.message,
    request_id: typeof body.request_id === 'string' ? body.request_id : null,
    details: body.details,
  };
}

export function getErrorStatus(error: unknown): number | string | null {
  if (!isFetchBaseQueryError(error)) return null;
  return error.status;
}

export function parseApiError(error: unknown): string {
  if (!isFetchBaseQueryError(error)) {
    return 'Something went wrong. Please try again.';
  }

  if (error.status === 'FETCH_ERROR') {
    return "We couldn't reach the server. Check that the API is running and try again.";
  }

  if (error.status === 'PARSING_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return 'The server returned an unexpected response. Please try again.';
  }

  const status = typeof error.status === 'number' ? error.status : null;
  const body = readErrorBody(error.data);

  if (status === 429) {
    return 'Too many requests. Please try again shortly.';
  }

  if (status !== null && status >= 500) {
    return 'Something went wrong on our side. Please try again.';
  }

  if (body?.message) return body.message;

  if (status === 400) return 'The request could not be completed.';
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status === 409) return 'That conflicts with something that already exists.';
  if (status === 422) return 'Please check the form and try again.';

  return 'Something went wrong. Please try again.';
}

export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}
