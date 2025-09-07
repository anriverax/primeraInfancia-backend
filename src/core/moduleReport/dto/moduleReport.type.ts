import { IPagination } from "@/common/helpers/types";
import { ModuleReport } from "@prisma/client";

export type ICreateModuleReport = Pick<
  ModuleReport,
  "moduleScore" | "status" | "trainingModuleId" | "inscriptionId" | "createdBy"
>;

export type IUpdateModuleReport = Pick<
  ModuleReport,
  "id" | "moduleScore" | "status" | "trainingModuleId" | "inscriptionId" | "updatedBy"
>;

export type IDeleteModuleReport = Pick<ModuleReport, "id" | "deletedBy">;

export interface IGetAllModuleReport {
  id: number;
  moduleScore: number;
  status: string;
  trainingModuleId: number;
  inscriptionId: number;
}

export interface IModuleReportsWithPagination {
  data: IGetAllModuleReport[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdModuleReport {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
