import { IPagination } from "@/common/helpers/dto";
import { GroupTrainer } from "@prisma/client";

export type ICreateGroupTrainer = Pick<GroupTrainer, "groupId" | "trainerId" | "createdBy">;

export type IUpdateGroupTrainer = Pick<GroupTrainer, "id" | "groupId" | "trainerId" | "updatedBy">;

export type IDeleteGroupTrainer = Pick<GroupTrainer, "id" | "deletedBy">;

export interface IGetAllGroupTrainer {
  id: number;
  groupId: number;
  trainerId: number;
}

export interface IGroupTrainersWithPagination {
  data: IGetAllGroupTrainer[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdGroupTrainer {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
