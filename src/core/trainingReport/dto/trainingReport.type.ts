import { IPagination } from "@/common/helpers/types";
import { TrainingReport } from "@prisma/client";

export type ICreateTrainingReport = Pick<
  TrainingReport,
  "finalScore" | "attendancePercentage" | "status" | "inscriptionId" | "createdBy"
>;

export type IUpdateTrainingReport = Pick<
  TrainingReport,
  "id" | "finalScore" | "attendancePercentage" | "status" | "updatedBy"
>;

export type IDeleteTrainingReport = Pick<TrainingReport, "id" | "deletedBy">;

export interface IGetAllTrainingReport {
  id: number;
  finalScore: number;
  attendancePercentage: number;
  status: string;
}

export interface ITrainingReportsWithPagination {
  data: IGetAllTrainingReport[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdTrainingReport {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
