import { IPagination } from "@/common/helpers/types";
import { Question } from "@prisma/client";

export type ICreateQuestion = Pick<
  Question,
  | "fieldName"
  | "text"
  | "questionType"
  | "orderBy"
  | "subSection"
  | "isRequired"
  | "options"
  | "sectionId"
  | "createdBy"
>;

export type IUpdateQuestion = Pick<
  Question,
  | "id"
  | "fieldName"
  | "text"
  | "questionType"
  | "orderBy"
  | "subSection"
  | "isRequired"
  | "options"
  | "sectionId"
  | "updatedBy"
>;

export type IDeleteQuestion = Pick<Question, "id" | "deletedBy">;

export interface IGetAllQuestion {
  id: number;
  fieldName: string;
  text: string;
  questionType: string;
  orderBy: number;
  subSection: string;
  isRequired: boolean;
  options?: string;
  sectionId: number;
}

export interface IQuestionsWithPagination {
  data: IGetAllQuestion[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdQuestion {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
