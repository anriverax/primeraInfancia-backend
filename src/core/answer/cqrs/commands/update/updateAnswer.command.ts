import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateAnswer } from "../../../dto/answer.type";

export class UpdateAnswerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateAnswer) {
    super();
  }
}
