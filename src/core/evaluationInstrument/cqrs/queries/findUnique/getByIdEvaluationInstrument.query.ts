import { IGetByIdEvaluationInstrument } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdEvaluationInstrumentQuery extends Query<IGetByIdEvaluationInstrument> {
  constructor(public readonly id: number) {
    super();
  }
}
