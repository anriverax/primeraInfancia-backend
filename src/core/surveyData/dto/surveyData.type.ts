import { IPagination } from "@/common/helpers/types";
import { SurveyData } from "@prisma/client";

export type ICreateSurveyData = Pick<
  SurveyData,
  "bash" | "appendixId" | "survey" | "inscriptionId"  | "createdBy"
>;

export type IUpdateSurveyData = Pick<
  SurveyData,
  "id" | "bash" | "appendixId" | "survey" | "inscriptionId" | "updatedBy"
>;

export type IDeleteSurveyData = Pick<SurveyData, "id" | "deletedBy">;

export interface IGetAllSurveyData {
  id: number;
  bash: number;
  appendixId: number;
  survey: Record<string, any>;
  inscriptionId: number;
}

export interface ISurveyDatasWithPagination {
  data: IGetAllSurveyData[];
  meta: IPagination;
}
