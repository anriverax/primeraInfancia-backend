import { IPagination } from "@/common/helpers/types";
import { SurveyData } from "@prisma/client";

export type ICreateSurveyData = Pick<
  SurveyData, "bash" | "appendixId" | "questionId" | "responseDetail" | "createdBy" 
>;

export type IUpdateSurveyData = Pick<
  SurveyData,
  "id" | "bash" | "appendixId" | "questionId" | "responseDetail" | "updatedBy" 
>;

export type IDeleteSurveyData = Pick<SurveyData, "id" | "deletedBy" >;

export interface IGetAllSurveyData extends Pick<SurveyData, "id" | "bash" | "appendixId" | "questionId" | "responseDetail" > { }

export interface ISurveyDatasWithPagination {
  data: IGetAllSurveyData[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdSurveyData  { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
