import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAnswerCommand } from "./deleteAnswer.command";
import { AnswerProjection } from "../../projections/answer.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteAnswerCommand)
export class DeleteAnswerHandler implements ICommandHandler<DeleteAnswerCommand> {
  constructor(private readonly answerProjection: AnswerProjection) {}
  async execute(command: DeleteAnswerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.answerProjection.delete(data);

    return {
      statusCode: 200,
      message: "Respuesta eliminada con éxito."
    };
  }
}
