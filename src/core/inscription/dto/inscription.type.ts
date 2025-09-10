import { IPagination } from "@/common/helpers/types";
import { Inscription } from "@prisma/client";

export type ICreateInscription = Pick<Inscription, "teacherId" | "groupId" | "createdBy">;

export type IUpdateInscription = Pick<Inscription, "id" | "teacherId" | "groupId" | "updatedBy">;

export type IDeleteInscription = Pick<Inscription, "id" | "deletedBy">;

export interface IGetAllInscription {
  id: number;
  teacherId: number;
  groupId: number;
}

export interface IInscriptionsWithPagination {
  data: IGetAllInscription[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdInscription {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
