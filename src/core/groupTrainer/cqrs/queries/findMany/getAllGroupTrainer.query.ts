import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IGroupTrainersWithPagination } from "@/core/groupTrainer/dto/groupTrainer.type";
import { Query } from "@nestjs/cqrs";

export class GetAllGroupTrainerQuery extends Query<IGroupTrainersWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
