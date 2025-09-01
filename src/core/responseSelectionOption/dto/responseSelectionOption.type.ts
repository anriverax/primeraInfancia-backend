import { IPagination } from "@/common/helpers/dto";
import { ResponseSelectionOption } from "@prisma/client";

export type ICreateResponseSelectionOption = Pick<
  ResponseSelectionOption, "answerId" | "optionId" | "createdBy" 
>;

export type IUpdateResponseSelectionOption = Pick<
  ResponseSelectionOption,
  "id" | "answerId" | "optionId" | "updatedBy" 
>;

export type IDeleteResponseSelectionOption = Pick<ResponseSelectionOption, "id" | "deletedBy" >;

export interface IGetAllResponseSelectionOption extends Pick<ResponseSelectionOption, "id" | "answerId" | "optionId" > { }

export interface IResponseSelectionOptionsWithPagination {
  data: IGetAllResponseSelectionOption[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdResponseSelectionOption  { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
