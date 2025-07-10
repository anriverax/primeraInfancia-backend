import { School } from "@prisma/client";

export type ICreateSchool = Pick<
  School,
  "name" | "sector" | "districtId" | "address" | "email" | "coordenates" | "phoneNumber" | "createdBy"
>;

export type IUpdateSchool = Pick<
  School,
  | "id"
  | "name"
  | "sector"
  | "districtId"
  | "address"
  | "email"
  | "coordenates"
  | "phoneNumber"
  | "updatedBy"
>;

export type IDeleteSchool = Pick<School, "id" | "deletedBy">;

export interface IGetSchool
  extends Pick<
    School,
    "id" | "name" | "sector" | "districtId" | "address" | "email" | "coordenates" | "phoneNumber"
  > { }
