import { IPagination } from "@/common/helpers/dto";
import { ModuleEvaluation } from "@prisma/client";

export type ICreateModuleEvaluation = Pick<
  ModuleEvaluation,
  "grade" | "comment" | "moduleProgressStatus" | "evaluationInstrumentId" | "enrollmentId" | "trainingModuleId" | "createdBy"
>;

export type IUpdateModuleEvaluation = Pick<
  ModuleEvaluation,
  | "id"
  | "grade"
  | "comment"
  | "moduleProgressStatus"
  | "evaluationInstrumentId"
  | "enrollmentId"
  | "updatedBy"
>;

export type IDeleteModuleEvaluation = Pick<ModuleEvaluation, "id" | "deletedBy">;

export interface IGetAllModuleEvaluation {
  id: number;
  grade: number;
  comment: string;
  moduleProgressStatus: string;
  evaluationInstrumentId: number;
  enrollmentId: number;

}

export interface IModuleEvaluationsWithPagination {
  data: IGetAllModuleEvaluation[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdModuleEvaluation { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
