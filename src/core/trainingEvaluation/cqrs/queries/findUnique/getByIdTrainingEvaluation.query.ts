import { IGetByIdTrainingEvaluation } from "@/core/trainingEvaluation/dto/trainingEvaluation.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdTrainingEvaluationQuery extends Query<IGetByIdTrainingEvaluation> {
  constructor(public readonly id: number) {
    super();
  }
}
