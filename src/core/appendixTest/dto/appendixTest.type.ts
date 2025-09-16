import { IPagination } from "@/common/helpers/types";
import { AppendixTest } from "@prisma/client";

export type ICreateAppendixTest = Pick<
  AppendixTest,
  "name" | "textQuestion" | "textAnswer" | "teacherRoleId" | "mentorRoleId" | "createdBy"
>;

export type IUpdateAppendixTest = Pick<
  AppendixTest,
  "id" | "name" | "textQuestion" | "textAnswer" | "teacherRoleId" | "mentorRoleId" | "updatedBy"
>;

export type IDeleteAppendixTest = Pick<AppendixTest, "id" | "deletedBy">;

export interface IGetAllAppendixTest {
  id: number;
  name: string;
  textQuestion: string;
  textAnswer: string;
  teacherRoleId: number;
  mentorRoleId: number;
}

export interface IAppendixsWithPagination {
  data: IGetAllAppendixTest[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdAppendixTest {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
