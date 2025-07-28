import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { ITrainingEvaluationsWithPagination } from "@/core/trainingEvaluation/dto/trainingEvaluation.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrainingEvaluationQuery extends Query<ITrainingEvaluationsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
