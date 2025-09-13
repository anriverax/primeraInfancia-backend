import { IPagination } from "@/common/helpers/types";
import { Answer } from "@prisma/client";

export type ICreateAnswer = Pick<
  Answer,
  | "valueText"
  | "valueNumber"
  | "valueDate"
  | "valueBoolean"
  | "questionId"
  | "responseSessionId"
  | "createdBy"
>;

export type IUpdateAnswer = Pick<
  Answer,
  | "id"
  | "valueText"
  | "valueNumber"
  | "valueDate"
  | "valueBoolean"
  | "questionId"
  | "responseSessionId"
  | "updatedBy"
>;

export type IDeleteAnswer = Pick<Answer, "id" | "deletedBy">;

export interface IGetAllAnswer {
  id: number;
  valueText: string;
  valueNumber: number;
  valueDate: Date;
  valueBoolean: boolean;
  questionId: number;
  responseSessionId: number;
}

export interface IAnswersWithPagination {
  data: IGetAllAnswer[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAnswer {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
