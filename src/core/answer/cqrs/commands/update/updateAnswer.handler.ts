import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAnswerCommand } from "./updateAnswer.command";
import { AnswerProjection } from "../../projections/answer.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateAnswerCommand)
export class UpdateAnswerHandler implements ICommandHandler<UpdateAnswerCommand> {
  constructor(private readonly answerProjection: AnswerProjection) {}
  async execute(command: UpdateAnswerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.answerProjection.update(data);

    return {
      statusCode: 200,
      message: "Respuesta actualizada con éxito."
    };
  }
}
