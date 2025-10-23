import { IPagination } from "@/common/helpers/types";
import { Appendix, Question } from "@prisma/client";

export type ICreateAppendix = Pick<
  Appendix,
  "title" | "subTitle" | "description" | "periodicity" | "iconName" | "color" | "createdBy"
>;

export type IUpdateAppendix = Pick<
  Appendix,
  "id" | "title" | "subTitle" | "description" | "periodicity" | "iconName" | "color" | "updatedBy"
>;

export type IDeleteAppendix = Pick<Appendix, "id" | "deletedBy">;

export interface IGetAllAppendix {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  periodicity: string;
  iconName: string;
  color: string;
}

export interface IAppendixsWithPagination {
  data: IGetAllAppendix[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAppendix {}
export interface IGetByIdAppendixDetail extends Pick<Appendix, "id" | "title"> {
  Section: {
    title: string;
    summary: string;
    orderBy: number;
    Question: Pick<
      Question,
      "id" | "text" | "questionType" | "orderBy" | "subSection" | "isRequired" | "fieldName" | "options"
    >[];
  }[];
}
/* eslint-enable @typescript-eslint/no-empty-object-type*/

export interface PersonAppendixDto {
  Person: {
    firstName: string;
    lastName1: string;
    lastName2: string | null;
  };
  Appendix: AppendixDto[];
}

export interface AppendixDto {
  title: string;
  questions: QuestionAnswerDto[];
}

export interface QuestionAnswerDto {
  questionText: string;
  answer: string;
}