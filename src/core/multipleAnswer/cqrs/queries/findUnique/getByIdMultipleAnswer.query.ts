import { IGetByIdMultipleAnswer } from "@/core/multipleAnswer/dto/multipleAnswer.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdMultipleAnswerQuery extends Query<IGetByIdMultipleAnswer> {
  constructor(public readonly id: number) {
    super();
  }
}
