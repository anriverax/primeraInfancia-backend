import { IPagination } from "@/common/helpers/types";
import { Section } from "@prisma/client";

export type ICreateSection = Pick<Section, "title" | "summary" | "orderBy" | "appendixId" | "createdBy">;

export type IUpdateSection = Pick<
  Section,
  "id" | "title" | "summary" | "orderBy" | "appendixId" | "updatedBy"
>;

export type IDeleteSection = Pick<Section, "id" | "deletedBy">;

export interface IGetAllSection {
  id: number;
  title: string;
  summary: string;
  orderBy: number;
  appendixId: number;
}

export interface ISectionsWithPagination {
  data: IGetAllSection[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdSection {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
