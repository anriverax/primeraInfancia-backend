import { IPagination } from "@/common/helpers/types";
import { Answer } from "@prisma/client";

export type ICreateAnswer = Pick<Answer, "valueText" | "questionId" | "inscriptionId" | "createdBy">;

export interface IGetAllAnswer {
  id: number;
  valueText: string;
  questionId: number;
  inscriptionId: number;
}

export interface IAnswersWithPagination {
  data: IGetAllAnswer[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAnswer {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
