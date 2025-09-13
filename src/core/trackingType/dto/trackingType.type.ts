import { IPagination } from "@/common/helpers/types";
import { TrackingType } from "@prisma/client";

export type ICreateTrackingType = Pick<TrackingType, "name" | "deliveryMethod" | "createdBy">;

export type IUpdateTrackingType = Pick<TrackingType, "id" | "name" | "deliveryMethod" | "updatedBy">;

export type IDeleteTrackingType = Pick<TrackingType, "id" | "deletedBy">;

export interface IGetAllTrackingType {
  id: number;
  name: string;
  deliveryMethod: string;
}

export interface ITrackingTypesWithPagination {
  data: IGetAllTrackingType[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdTrackingType {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
