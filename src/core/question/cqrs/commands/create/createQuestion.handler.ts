import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateQuestionCommand } from "./createQuestion.command";
import { QuestionProjection } from "../../projections/question.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Question } from "@prisma/client";

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler implements ICommandHandler<CreateQuestionCommand> {
  constructor(private readonly questionProjection: QuestionProjection) {}
  async execute(command: CreateQuestionCommand): Promise<NestResponse<Question>> {
    const { data } = command;

    const res = await this.questionProjection.create(data);

    return {
      statusCode: 201,
      message: "Pregunta creada con éxito.",
      data: res
    };
  }
}
