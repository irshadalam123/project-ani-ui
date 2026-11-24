export interface Pagination {
  page: number;
  page_size: number;
  total: number;
}

export interface PageResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface PageQuery {
  page?: number;
  page_size?: number;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  request_id?: string | null;
  details?: unknown;
}

export interface DeletedData {
  deleted: boolean;
}
