import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrainingEvaluationCommand } from "./updateTrainingEvaluation.command";
import { TrainingEvaluationProjection } from "../../projections/trainingEvaluation.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateTrainingEvaluationCommand)
export class UpdateTrainingEvaluationHandler
  implements ICommandHandler<UpdateTrainingEvaluationCommand>
{
  constructor(private readonly trainingEvaluationProjection: TrainingEvaluationProjection) {}
  async execute(command: UpdateTrainingEvaluationCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingEvaluationProjection.update(data);

    return {
      statusCode: 200,
      message: "Evaluación de la formación actualizada con éxito."
    };
  }
}
