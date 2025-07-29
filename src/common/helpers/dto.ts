export interface NestResponse<T> {
  statusCode: number;
  message: string[] | string;
  data?: T | T[];
}

export interface IPagination {
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}
export interface NestResponseWithPagination<T> extends NestResponse<T> {
  meta: IPagination;
}

export interface IPaginatedQueryParams {
  page?: number;
  limit?: number;
}
