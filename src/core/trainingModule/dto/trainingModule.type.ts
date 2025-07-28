import { IPagination } from "@/common/helpers/dto";
import { TrainingModule } from "@prisma/client";

export type ICreateTrainingModule = Pick<TrainingModule, "moduleName" | "createdBy">;

export type IUpdateTrainingModule = Pick<TrainingModule, "id" | "moduleName" | "updatedBy">;

export type IDeleteTrainingModule = Pick<TrainingModule, "id" | "deletedBy">;

export interface IGetAllTrainingModule {
  id: number;
  moduleName: string;
}

export interface ITrainingModulesWithPagination {
  data: IGetAllTrainingModule[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type IGetByIdTrainingModule = {};
/* eslint-enable @typescript-eslint/no-empty-object-type*/
