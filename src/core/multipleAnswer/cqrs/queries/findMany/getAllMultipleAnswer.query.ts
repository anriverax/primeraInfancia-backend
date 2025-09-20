import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IMultipleAnswersWithPagination } from "@/core/multipleAnswer/dto/multipleAnswer.type";
import { Query } from "@nestjs/cqrs";

export class GetAllMultipleAnswerQuery extends Query<IMultipleAnswersWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
