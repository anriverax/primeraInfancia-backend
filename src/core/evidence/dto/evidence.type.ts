import { IPagination } from "@/common/helpers/types";
import { Evidence } from "@prisma/client";

export type ICreateEvidence = Pick<Evidence, "Evidence" | "trackingId" | "createdBy">;

export type IUpdateEvidence = Pick<Evidence, "id" | "Evidence" | "trackingId" | "updatedBy">;

export type IDeleteEvidence = Pick<Evidence, "id" | "deletedBy">;

export interface IGetAllEvidence {
  id: number;
  Evidence: string;
  trackingId: number;
}

export interface IEvidencesWithPagination {
  data: IGetAllEvidence[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdEvidence {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
