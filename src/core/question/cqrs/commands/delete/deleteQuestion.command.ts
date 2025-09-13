import { NestResponse } from "@/common/helpers/types";
import { IDeleteQuestion } from "@/core/question/dto/question.type";
import { Command } from "@nestjs/cqrs";

export class DeleteQuestionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteQuestion) {
    super();
  }
}
