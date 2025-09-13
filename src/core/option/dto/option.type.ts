import { IPagination } from "@/common/helpers/types";
import { Option } from "@prisma/client";

export type ICreateOption = Pick<Option, "text" | "value" | "questionId" | "createdBy">;

export type IUpdateOption = Pick<Option, "id" | "text" | "value" | "questionId" | "updatedBy">;

export type IDeleteOption = Pick<Option, "id" | "deletedBy">;

export interface IGetAllOption {
  id: number;
  text: string;
  value: string;
  questionId: number;
}

export interface IOptionsWithPagination {
  data: IGetAllOption[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdOption {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
