import { IPagination } from "@/common/helpers/types";
import { MultipleAnswer } from "@prisma/client";

export type ICreateMultipleAnswer = Pick<MultipleAnswer, "answerId" | "optionId" | "createdBy">;

export type IUpdateMultipleAnswer = Pick<MultipleAnswer, "id" | "answerId" | "optionId" | "updatedBy">;

export type IDeleteMultipleAnswer = Pick<MultipleAnswer, "id" | "deletedBy">;

export interface IGetAllMultipleAnswer {
  id: number;
  answerId: number;
  optionId: number;
}

export interface IMultipleAnswersWithPagination {
  data: IGetAllMultipleAnswer[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdMultipleAnswer {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
