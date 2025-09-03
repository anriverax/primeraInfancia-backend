import { IPagination } from "@/common/helpers/dto";
import { ResponseSession } from "@prisma/client";

export type ICreateResponseSession = Pick<
  ResponseSession,
  | "status"
  // | "inscriptionId" | "instrumentId" | "trackingId" |
  | "createdBy"
>;

export type IUpdateResponseSession = Pick<
  ResponseSession,
  | "id"
  | "status"
  //"inscriptionId" | "instrumentId" | "trackingId" |
  | "updatedBy"
>;

export type IDeleteResponseSession = Pick<ResponseSession, "id" | "deletedBy">;

export interface IGetAllResponseSession {
  id: number;
  status: string;
  // inscriptionId: number;
  // instrumentId: number;
  // trackingId: number;
}

export interface IResponseSessionsWithPagination {
  data: IGetAllResponseSession[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdResponseSession {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
