import { NestResponse } from "@/common/helpers/dto";
import { IDeleteQuestion } from "@/core/question/dto/question.type";
import { Command } from "@nestjs/cqrs";

export class DeleteQuestionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteQuestion) {
    super();
  }
}
