import { IPagination } from "@/common/helpers/types";
import { Tracking } from "@prisma/client";

export type ICreateTracking = Pick<
  Tracking,
  "name" | "description" | "start" | "finish" | "trackingTypeId" | "createdBy"
>;

export type IUpdateTracking = Pick<
  Tracking,
  "id" | "name" | "description" | "start" | "finish" | "trackingTypeId" | "updatedBy"
>;

export type IDeleteTracking = Pick<Tracking, "id" | "deletedBy">;

export interface IGetAllTracking {
  id: number;
  name: string;
  description: string;
  start: Date;
  finish: Date;
  trackingTypeId: number;
}

export interface ITrackingsWithPagination {
  data: IGetAllTracking[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdTracking {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
