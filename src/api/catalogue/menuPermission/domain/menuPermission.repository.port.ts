import { IGenericRepository } from "@/common/generic/domain/generic.repository.port";

export interface IMenuPermissionSelect {
  Menu: { select: { path: true; order: true } };
  Permission: { select: { name: true } };
}

export interface IMenuPermissionOrderBy {
  Menu: { order: "asc" };
}

export interface IMenuPermissionResponse {
  Menu: {
    path: string;
    order: number;
  };
  Permission: {
    name: string;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type*/
export interface IMenuPermissionRepository<U = any, V = any, W = any> extends Pick<
  IGenericRepository<U, V, W>,
  "findMany"
> {}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type*/
