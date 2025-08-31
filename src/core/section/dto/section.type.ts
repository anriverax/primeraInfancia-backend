import { IPagination } from "@/common/helpers/dto";
import { Section } from "@prisma/client";

export type ICreateSection = Pick<
  Section, "title" | "summary" | "orderBy" | "instrumentId" | "createdBy" 
>;

export type IUpdateSection = Pick<
  Section,
  "id" | "title" | "summary" | "orderBy" | "instrumentId" | "updatedBy" 
>;

export type IDeleteSection = Pick<Section, "id" | "deletedBy" >;

export interface IGetAllSection extends Pick<Section, "id" | "title" | "summary" | "orderBy" | "instrumentId" > { }

export interface ISectionsWithPagination {
  data: IGetAllSection[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdSection  { }
/* eslint-enable @typescript-eslint/no-empty-object-type*/
