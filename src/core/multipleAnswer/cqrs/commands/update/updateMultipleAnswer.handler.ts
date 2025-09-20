import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMultipleAnswerCommand } from "./updateMultipleAnswer.command";
import { MultipleAnswerProjection } from "../../projections/multipleAnswer.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateMultipleAnswerCommand)
export class UpdateMultipleAnswerHandler implements ICommandHandler<UpdateMultipleAnswerCommand> {
  constructor(private readonly multipleAnswerProjection: MultipleAnswerProjection) {}
  async execute(command: UpdateMultipleAnswerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.multipleAnswerProjection.update(data);

    return {
      statusCode: 200,
      message: "Respuesta a las opciones actualizada con éxito."
    };
  }
}
