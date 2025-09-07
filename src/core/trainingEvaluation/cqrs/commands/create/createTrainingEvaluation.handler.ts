import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrainingEvaluationCommand } from "./createTrainingEvaluation.command";
import { TrainingEvaluationProjection } from "../../projections/trainingEvaluation.projection";
import { NestResponse } from "@/common/helpers/types";
import { TrainingEvaluation } from "@prisma/client";

@CommandHandler(CreateTrainingEvaluationCommand)
export class CreateTrainingEvaluationHandler
  implements ICommandHandler<CreateTrainingEvaluationCommand>
{
  constructor(private readonly trainingEvaluationProjection: TrainingEvaluationProjection) {}
  async execute(command: CreateTrainingEvaluationCommand): Promise<NestResponse<TrainingEvaluation>> {
    const { data } = command;

    const res = await this.trainingEvaluationProjection.create(data);

    return {
      statusCode: 201,
      message: "Evaluación de la formación creada con éxito.",
      data: res
    };
  }
}
