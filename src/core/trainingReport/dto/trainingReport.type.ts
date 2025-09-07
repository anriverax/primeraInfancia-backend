import { IPagination } from "@/common/helpers/types";
import { TrainingReport } from "@prisma/client";

export type ICreateTrainingReport = Pick<
  TrainingReport,
  "finalScore" | "status" | "remark" | "inscriptionId" | "createdBy"
>;

export type IUpdateTrainingReport = Pick<
  TrainingReport,
  "id" | "finalScore" | "status" | "remark" | "updatedBy"
>;

export type IDeleteTrainingReport = Pick<TrainingReport, "id" | "deletedBy">;

export interface IGetAllTrainingReport {
  id: number;
  finalScore: number;
  status: string;
  remark: string;
}

export interface ITrainingReportsWithPagination {
  data: IGetAllTrainingReport[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdTrainingReport {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
