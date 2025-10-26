import { IPagination } from "@/common/helpers/types";
import { SurveyData } from "@prisma/client";

export type ICreateSurveyData = Pick<
  SurveyData,
  "bash" | "appendixId" | "questionId" | "inscriptionId" | "responseDetail" | "createdBy"
>;

export type IUpdateSurveyData = Pick<
  SurveyData,
  "id" | "bash" | "appendixId" | "questionId" | "inscriptionId" | "responseDetail" | "updatedBy"
>;

export type IDeleteSurveyData = Pick<SurveyData, "id" | "deletedBy">;

export interface IGetAllSurveyData {
  id: number;
  bash: number;
  appendixId: number;
  questionId: number;
  inscriptionId: number;
  responseDetail: string;
}

export interface ISurveyDatasWithPagination {
  data: IGetAllSurveyData[];
  meta: IPagination;
}
