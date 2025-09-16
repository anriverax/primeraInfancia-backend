import { Query } from "@nestjs/cqrs";
import { IGetAllEvaluationInstrument } from "@/core/catalogue/evaluationInstrument/dto/evaluationInstrument.type";

export class GetAllEvaluationInstrumentQuery extends Query<IGetAllEvaluationInstrument[]> {
  constructor() {
    super();
  }
}
