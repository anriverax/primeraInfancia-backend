import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { ITrainingModulesWithPagination } from "@/core/trainingModule/dto/trainingModule.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrainingModuleQuery extends Query<ITrainingModulesWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
