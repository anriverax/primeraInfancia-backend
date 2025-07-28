import { IPagination } from "@/common/helpers/dto";
import { PersonRole } from "@prisma/client";

export type ICreatePersonRole = Pick<PersonRole, "typePersonId" | "personId" | "createdBy">;

export type IUpdatePersonRole = Pick<PersonRole, "id" | "typePersonId" | "personId" | "updatedBy">;

export type IDeletePersonRole = Pick<PersonRole, "id" | "deletedBy">;

export interface IGetAllPersonRole {
  id: number;
  typePersonId: number;
  personId: number;
}

export interface IPersonRolesWithPagination {
  data: IGetAllPersonRole[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdPersonRole {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
