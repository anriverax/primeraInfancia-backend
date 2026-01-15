import { IPagination } from "@/common/helpers/types";
import { Person } from "@prisma/client";

export type ICreatePerson = Pick<
  Person, "firstName" | "lastName1" | "lastName2" | "dui" | "address" | "gender" | "phoneNumber" | "birthDate" | "career" | "nip" | "typePersonId" | "districtId" | "cohortId" | "createdBy" 
>;

export type IUpdatePerson = Pick<
  Person,
  "id" | "firstName" | "lastName1" | "lastName2" | "dui" | "address" | "gender" | "phoneNumber" | "birthDate" | "career" | "nip" | "typePersonId" | "districtId" | "cohortId" | "updatedBy" 
>;

export type IDeletePerson = Pick<Person, "id" | "deletedBy" >;

export interface IGetAllPerson extends Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "dui" | "address" | "gender" | "phoneNumber" | "birthDate" | "career" | "nip" | "typePersonId" | "districtId" | "cohortId" > { }

export interface IPersonsWithPagination {
  data: IGetAllPerson[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdPerson  { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
