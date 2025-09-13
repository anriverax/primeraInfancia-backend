import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IInstrumentsWithPagination } from "@/core/instrument/dto/instrument.type";
import { Query } from "@nestjs/cqrs";

export class GetAllInstrumentQuery extends Query<IInstrumentsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
