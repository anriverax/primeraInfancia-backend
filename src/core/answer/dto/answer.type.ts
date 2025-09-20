import { IPagination } from "@/common/helpers/types";
import { Answer } from "@prisma/client";

export type ICreateAnswer = Pick<
  Answer, "valueText" | "questionId" | "responseSessionId" | "createdBy"
>;

export type IUpdateAnswer = Pick<
  Answer,
  "id" | "valueText" | "questionId" | "responseSessionId" | "updatedBy"
>;

export type IDeleteAnswer = Pick<Answer, "id" | "deletedBy">;

export interface IGetAllAnswer {
  "id": number,
  "valueText": string,
  "questionId": string,
  "responseSessionId": string,
}

export interface IAnswersWithPagination {
  data: IGetAllAnswer[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAnswer { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
