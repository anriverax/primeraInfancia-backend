import { IPagination } from "@/common/helpers/types";
import { TrainingModule } from "@prisma/client";

export type ICreateTrainingModule = Pick<
  TrainingModule,
  "name" | "title" | "startDate" | "endDate" | "hours" | "cohortId"
>;

export type IUpdateTrainingModule = Pick<
  TrainingModule,
  "id" | "name" | "title" | "startDate" | "endDate" | "hours" | "cohortId"
>;

export type IDeleteTrainingModule = Pick<TrainingModule, "id">;

export interface IGetAllTrainingModule {
  id: number;
  name: string;
  title: string;
  startDate: Date;
  endDate: Date;
  hours: number;
}

export interface ITrainingModulesWithPagination {
  data: IGetAllTrainingModule[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type IGetByIdTrainingModule = {};
/* eslint-enable @typescript-eslint/no-empty-object-type*/
