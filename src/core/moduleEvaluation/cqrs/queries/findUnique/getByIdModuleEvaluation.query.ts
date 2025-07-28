import { IGetByIdModuleEvaluation } from "@/core/moduleEvaluation/dto/moduleEvaluation.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdModuleEvaluationQuery extends Query<IGetByIdModuleEvaluation> {
  constructor(public readonly id: number) {
    super();
  }
}
