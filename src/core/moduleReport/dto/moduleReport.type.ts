import { IPagination } from "@/common/helpers/dto";
import { ModuleReport } from "@prisma/client";

export type ICreateModuleReport = Pick<
  ModuleReport,
  "moduleScore" | "status" | "trainingModuleId" | "enrollmentId" | "createdBy"
>;

export type IUpdateModuleReport = Pick<
  ModuleReport,
  "id" | "moduleScore" | "status" | "trainingModuleId" | "enrollmentId" | "updatedBy"
>;

export type IDeleteModuleReport = Pick<ModuleReport, "id" | "deletedBy">;

export interface IGetAllModuleReport {
  id: number;
  moduleScore: number;
  status: string;
  trainingModuleId: number;
  enrollmentId: number;
}

export interface IModuleReportsWithPagination {
  data: IGetAllModuleReport[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdModuleReport {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
