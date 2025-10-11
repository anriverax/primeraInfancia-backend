import { IPagination } from "@/common/helpers/types";
import { EvaluationInstrument } from "@prisma/client";

export type ICreateEvaluationInstrument = Pick<
  EvaluationInstrument,
  "code" | "name" | "periodicity" | "percentage"
>;

export type IUpdateEvaluationInstrument = Pick<
  EvaluationInstrument,
  "id" | "code" | "name" | "periodicity" | "percentage"
>;

export type IDeleteEvaluationInstrument = Pick<EvaluationInstrument, "id">;

export interface IGetAllEvaluationInstrument {
  id: number;
  code: string;
  name: string;
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
