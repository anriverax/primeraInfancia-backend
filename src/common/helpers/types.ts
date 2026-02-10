import { StoredEventAction } from "prisma/generated/enums";

export interface NestResponse<T> {
  statusCode: number;
  message: string[] | string;
  data?: T | T[];
}

export interface IPaginatedQueryParams {
  page?: number;
  limit?: number;
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
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IStoredEventData {
  entityType: string;
  entityId: number;
  action: StoredEventAction;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  createdBy: number;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
