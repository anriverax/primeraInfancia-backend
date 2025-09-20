import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteMultipleAnswerCommand } from "./deleteMultipleAnswer.command";
import { MultipleAnswerProjection } from "../../projections/multipleAnswer.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteMultipleAnswerCommand)
export class DeleteMultipleAnswerHandler implements ICommandHandler<DeleteMultipleAnswerCommand> {
  constructor(private readonly multipleAnswerProjection: MultipleAnswerProjection) {}
  async execute(command: DeleteMultipleAnswerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.multipleAnswerProjection.delete(data);

    return {
      statusCode: 200,
      message: "Respuesta a las opciones eliminada con éxito."
    };
  }
}
