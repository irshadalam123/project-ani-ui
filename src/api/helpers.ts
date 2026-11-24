import type { PageQuery, PageResult, Pagination } from '@/types/common';

export interface Envelope<T> {
  success: boolean;
  data: T;
}

export interface ListEnvelope<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export function unwrapData<T>(response: Envelope<T>): T {
  return response.data;
}

export function unwrapList<T>(response: ListEnvelope<T>): PageResult<T> {
  return { items: response.data, pagination: response.pagination };
}

export function pageParams(query: PageQuery = {}): { page: number; page_size: number } {
  return {
    page: query.page ?? 1,
    page_size: query.page_size ?? 20,
  };
}
