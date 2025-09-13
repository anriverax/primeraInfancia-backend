import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateQuestionCommand } from "./updateQuestion.command";
import { QuestionProjection } from "../../projections/question.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler implements ICommandHandler<UpdateQuestionCommand> {
  constructor(private readonly questionProjection: QuestionProjection) {}
  async execute(command: UpdateQuestionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.questionProjection.update(data);

    return {
      statusCode: 200,
      message: "Pregunta actualizada con éxito."
    };
  }
}
