import { IPagination } from "@/common/helpers/dto";
import { Enrollment } from "@prisma/client";

export type ICreateEnrollment = Pick<
  Enrollment,
  "teacherId" | "groupId" | "administrativeStatus" | "createdBy"
>;

export type IUpdateEnrollment = Pick<
  Enrollment,
  "id" | "teacherId" | "groupId" | "administrativeStatus" | "updatedBy"
>;

export type IDeleteEnrollment = Pick<Enrollment, "id" | "deletedBy">;

export interface IGetAllEnrollment {
  id: number;
  teacherId: number;
  groupId: number;
  administrativeStatus: string;
}

export interface IEnrollmentsWithPagination {
  data: IGetAllEnrollment[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdEnrollment {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
