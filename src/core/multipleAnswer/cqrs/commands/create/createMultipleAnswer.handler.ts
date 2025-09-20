import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMultipleAnswerCommand } from "./createMultipleAnswer.command";
import { MultipleAnswerProjection } from "../../projections/multipleAnswer.projection";
import { NestResponse } from "@/common/helpers/types";
import { MultipleAnswer } from "@prisma/client";

@CommandHandler(CreateMultipleAnswerCommand)
export class CreateMultipleAnswerHandler implements ICommandHandler<CreateMultipleAnswerCommand> {
  constructor(private readonly multipleAnswerProjection: MultipleAnswerProjection) {}
  async execute(command: CreateMultipleAnswerCommand): Promise<NestResponse<MultipleAnswer>> {
    const { data } = command;

    const res = await this.multipleAnswerProjection.create(data);

    return {
      statusCode: 201,
      message: "Respuesta a las opciones creada con éxito.",
      data: res
    };
  }
}
