import { IPagination } from "@/common/helpers/types";
import { Prisma, SurveyData } from "@prisma/client";

export type ICreateSurveyData = Pick<
  SurveyData,
  "appendixId" | "survey" | "inscriptionId" | "createdBy"
>;

export type IUpdateSurveyData = Pick<
  SurveyData,
  "id" | "appendixId" | "survey" | "inscriptionId" | "updatedBy"
>;

export type IDeleteSurveyData = Pick<SurveyData, "id" | "deletedBy">;

export interface IGetAllSurveyData {
  id: number;
  bash: number;
  appendixId: number;

  survey: Prisma.JsonValue;

  inscriptionId: number;
}

export interface ISurveyDatasWithPagination {
  data: IGetAllSurveyData[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdSurveyData {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
