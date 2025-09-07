import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IModuleEvaluationsWithPagination } from "@/core/moduleEvaluation/dto/moduleEvaluation.type";
import { Query } from "@nestjs/cqrs";

export class GetAllModuleEvaluationQuery extends Query<IModuleEvaluationsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
