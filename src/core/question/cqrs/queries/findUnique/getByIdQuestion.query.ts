import { IGetByIdQuestion } from "@/core/question/dto/question.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdQuestionQuery extends Query<IGetByIdQuestion> {
  constructor(public readonly id: number) {
    super();
  }
}
