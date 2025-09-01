import { IPagination } from "@/common/helpers/dto";
import { DetailOption } from "@prisma/client";

export type ICreateDetailOption = Pick<DetailOption, "textToDisplay" | "optionId" | "createdBy">;

export type IUpdateDetailOption = Pick<DetailOption, "id" | "textToDisplay" | "optionId" | "updatedBy">;

export type IDeleteDetailOption = Pick<DetailOption, "id" | "deletedBy">;

export interface IGetAllDetailOption {
  id: number;
  textToDisplay: string;
  optionId: number;
}

export interface IDetailOptionsWithPagination {
  data: IGetAllDetailOption[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdDetailOption {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
