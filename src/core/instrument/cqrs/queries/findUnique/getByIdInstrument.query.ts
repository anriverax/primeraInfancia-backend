import { IGetByIdInstrument, IGetByIdInstrumentDetail } from "@/core/instrument/dto/instrument.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdInstrumentQuery extends Query<IGetByIdInstrument> {
  constructor(public readonly id: number) {
    super();
  }
}

export class GetByDetailInstrumentQuery extends Query<IGetByIdInstrumentDetail> {
  constructor(public readonly id: number) {
    super();
  }
}