import { IPagination } from "@/common/helpers/types";
import { ModuleEvaluation } from "@prisma/client";

export type ICreateModuleEvaluation = Pick<
  ModuleEvaluation,
  "grade" | "evaluationInstrumentId" | "inscriptionId" | "trainingModuleId" | "createdBy"
>;

export type IUpdateModuleEvaluation = Pick<
  ModuleEvaluation,
  "id" | "grade" | "evaluationInstrumentId" | "inscriptionId" | "updatedBy"
>;

export type IDeleteModuleEvaluation = Pick<ModuleEvaluation, "id" | "deletedBy">;

export interface IGetAllModuleEvaluation {
  id: number;
  grade: number;
  evaluationInstrumentId: number;
  inscriptionId: number;
}

export interface IModuleEvaluationsWithPagination {
  data: IGetAllModuleEvaluation[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdModuleEvaluation {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
