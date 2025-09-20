import { NestResponse } from "@/common/helpers/types";
import { IDeleteMultipleAnswer } from "@/core/multipleAnswer/dto/multipleAnswer.type";
import { Command } from "@nestjs/cqrs";

export class DeleteMultipleAnswerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteMultipleAnswer) {
    super();
  }
}
