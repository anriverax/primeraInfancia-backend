import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IQuestionsWithPagination } from "@/core/question/dto/question.type";
import { Query } from "@nestjs/cqrs";

export class GetAllQuestionQuery extends Query<IQuestionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
