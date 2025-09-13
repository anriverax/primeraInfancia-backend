import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateQuestion } from "../../../dto/question.type";

export class UpdateQuestionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateQuestion) {
    super();
  }
}
