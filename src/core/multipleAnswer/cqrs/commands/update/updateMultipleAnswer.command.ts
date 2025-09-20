import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateMultipleAnswer } from "../../../dto/multipleAnswer.type";

export class UpdateMultipleAnswerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateMultipleAnswer) {
    super();
  }
}
