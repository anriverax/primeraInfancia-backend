import { IGetByIdAnswer } from "@/core/answer/dto/answer.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdAnswerQuery extends Query<IGetByIdAnswer> {
  constructor(public readonly id: number) {
    super();
  }
}
