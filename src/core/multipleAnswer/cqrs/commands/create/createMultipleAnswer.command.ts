import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateMultipleAnswer } from "../../../dto/multipleAnswer.type";
import { MultipleAnswer } from "@prisma/client";

export class CreateMultipleAnswerCommand extends Command<NestResponse<MultipleAnswer>> {
  constructor(public readonly data: ICreateMultipleAnswer) {
    super();
  }
}
