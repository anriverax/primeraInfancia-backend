import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteQuestionCommand } from "./deleteQuestion.command";
import { QuestionProjection } from "../../projections/question.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler implements ICommandHandler<DeleteQuestionCommand> {
  constructor(private readonly questionProjection: QuestionProjection) {}
  async execute(command: DeleteQuestionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.questionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Pregunta eliminada con éxito."
    };
  }
}
