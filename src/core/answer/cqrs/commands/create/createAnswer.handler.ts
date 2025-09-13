import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAnswerCommand } from "./createAnswer.command";
import { AnswerProjection } from "../../projections/answer.projection";
import { NestResponse } from "@/common/helpers/types";
import { Answer } from "@prisma/client";

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerHandler implements ICommandHandler<CreateAnswerCommand> {
  constructor(private readonly answerProjection: AnswerProjection) {}
  async execute(command: CreateAnswerCommand): Promise<NestResponse<Answer>> {
    const { data } = command;

    const res = await this.answerProjection.create(data);

    return {
      statusCode: 201,
      message: "Respuesta creada con éxito.",
      data: res
    };
  }
}
