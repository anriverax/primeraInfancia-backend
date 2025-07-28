import { IPagination } from "@/common/helpers/dto";
import { EvaluationInstrument } from "@prisma/client";

export type ICreateEvaluationInstrument = Pick<
  EvaluationInstrument,
  "instrumentName" | "periodicity" | "percentage" | "createdBy"
>;

export type IUpdateEvaluationInstrument = Pick<
  EvaluationInstrument,
  "id" | "instrumentName" | "periodicity" | "percentage" | "updatedBy"
>;

export type IDeleteEvaluationInstrument = Pick<EvaluationInstrument, "id" | "deletedBy">;

export interface IGetAllEvaluationInstrument {
  id: number;
  instrumentName: string;
  periodicity: string;
  percentage: number;
}

export interface IEvaluationInstrumentsWithPagination {
  data: IGetAllEvaluationInstrument[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdEvaluationInstrument {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
