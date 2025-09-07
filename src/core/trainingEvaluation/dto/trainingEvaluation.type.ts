import { IPagination } from "@/common/helpers/types";
import { TrainingEvaluation } from "@prisma/client";

export type ICreateTrainingEvaluation = Pick<
  TrainingEvaluation,
  "grade" | "comment" | "evaluationInstrumentId" | "inscriptionId" | "createdBy"
>;

export type IUpdateTrainingEvaluation = Pick<
  TrainingEvaluation,
  "id" | "grade" | "comment" | "evaluationInstrumentId" | "inscriptionId" | "updatedBy"
>;

export type IDeleteTrainingEvaluation = Pick<TrainingEvaluation, "id" | "deletedBy">;

export interface IGetAllTrainingEvaluation {
  id: number;
  grade: number;
  comment: string;
  evaluationInstrumentId: number;
  inscriptionId: number;
}

export interface ITrainingEvaluationsWithPagination {
  data: IGetAllTrainingEvaluation[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdTrainingEvaluation {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
