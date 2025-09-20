import { IPagination } from "@/common/helpers/types";
import { Appendix } from "@prisma/client";

export type ICreateAppendix = Pick<Appendix, "title" | "subTitle" | "description" | "createdBy">;

export type IUpdateAppendix = Pick<Appendix, "id" | "title" | "subTitle" | "description" | "updatedBy">;

export type IDeleteAppendix = Pick<Appendix, "id" | "deletedBy">;

export interface IGetAllAppendix {
  id: number;
  title: string;
  subTitle: string;
  description: string;
}

export interface IAppendixsWithPagination {
  data: IGetAllAppendix[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAppendix {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
