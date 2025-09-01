import { IPagination } from "@/common/helpers/dto";
import { Instrument } from "@prisma/client";

export type ICreateInstrument = Pick<Instrument, "title" | "subTitle" | "description" | "createdBy">;

export type IUpdateInstrument = Pick<
  Instrument,
  "id" | "title" | "subTitle" | "description" | "updatedBy"
>;

export type IDeleteInstrument = Pick<Instrument, "id" | "deletedBy">;

export interface IGetAllInstrument {
  id: number;
  title: string;
  subTitle: string;
  description: string;
}

export interface IInstrumentsWithPagination {
  data: IGetAllInstrument[];
  meta: IPagination;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetByIdInstrument {}
export interface IGetByIdInstrumentDetail {}
/* eslint-enable @typescript-eslint/no-empty-object-type*/
