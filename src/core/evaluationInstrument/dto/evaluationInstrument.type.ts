import { IPagination } from "@/common/helpers/dto";
import { EvaluationInstrument } from "@prisma/client";

export type ICreateEvaluationInstrument = Pick<
  EvaluationInstrument, "instrumentName" | "periodicity" | "percentage" | "createdBy" 
>;

export type IUpdateEvaluationInstrument = Pick<
  EvaluationInstrument,
  "id" | "instrumentName" | "periodicity" | "percentage" | "updatedBy" 
>;

export type IDeleteEvaluationInstrument = Pick<EvaluationInstrument, "id" | "deletedBy" >;

export interface IGetAllEvaluationInstrument extends Pick<EvaluationInstrument, "id" | "instrumentName" | "periodicity" | "percentage" > { }

export interface IEvaluationInstrumentsWithPagination {
  data: IGetAllEvaluationInstrument[];
  meta: IPagination;
}

export interface IGetByIdEvaluationInstrument  { }
