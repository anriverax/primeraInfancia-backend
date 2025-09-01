import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IAnswersWithPagination } from "@/core/answer/dto/answer.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAnswerQuery extends Query<IAnswersWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
