import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateQuestion } from "../../../dto/question.type";
import { Question } from "@prisma/client";

export class CreateQuestionCommand extends Command<NestResponse<Question>> {
  constructor(public readonly data: ICreateQuestion) {
    super();
  }
}
