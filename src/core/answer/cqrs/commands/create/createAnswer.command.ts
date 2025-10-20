import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateAnswer } from "../../../dto/answer.type";
import { Answer } from "@prisma/client";

export class CreateAnswerCommand extends Command<NestResponse<Answer>> {
  constructor(public readonly data: ICreateAnswer) {
    super();
  }
}
