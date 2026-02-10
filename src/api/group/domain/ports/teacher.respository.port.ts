import { IGenericRepository } from "@/common/generic/domain/generic.repository.port";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type*/
export interface ITeacherRepository<U = any, V = any, W = any> extends Pick<
  IGenericRepository<U, V, W>,
  "findMany" | "create" | "update" | "findFirst" | "softDelete"
> {}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type*/
