import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IEvaluationInstrumentsWithPagination } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEvaluationInstrumentQuery extends Query<IEvaluationInstrumentsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
