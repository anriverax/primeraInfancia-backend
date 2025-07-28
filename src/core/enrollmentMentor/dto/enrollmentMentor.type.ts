import { IPagination } from "@/common/helpers/dto";
import { EnrollmentMentor } from "@prisma/client";

export type ICreateEnrollmentMentor = Pick<EnrollmentMentor, "enrollmentId" | "mentorId" | "createdBy">;

export type IUpdateEnrollmentMentor = Pick<
  EnrollmentMentor,
  "id" | "enrollmentId" | "mentorId" | "updatedBy"
>;

export type IDeleteEnrollmentMentor = Pick<EnrollmentMentor, "id" | "deletedBy">;

export interface IGetAllEnrollmentMentor {
  id: number;
  enrollmentId: number;
  mentorId: number;
}

export interface IEnrollmentMentorsWithPagination {
  data: IGetAllEnrollmentMentor[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdEnrollmentMentor {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
