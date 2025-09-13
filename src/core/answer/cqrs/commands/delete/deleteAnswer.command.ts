import { NestResponse } from "@/common/helpers/types";
import { IDeleteAnswer } from "@/core/answer/dto/answer.type";
import { Command } from "@nestjs/cqrs";

export class DeleteAnswerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteAnswer) {
    super();
  }
}
