import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrainingEvaluationCommand } from "./deleteTrainingEvaluation.command";
import { TrainingEvaluationProjection } from "../../projections/trainingEvaluation.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteTrainingEvaluationCommand)
export class DeleteTrainingEvaluationHandler
  implements ICommandHandler<DeleteTrainingEvaluationCommand>
{
  constructor(private readonly trainingEvaluationProjection: TrainingEvaluationProjection) {}
  async execute(command: DeleteTrainingEvaluationCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingEvaluationProjection.delete(data);

    return {
      statusCode: 200,
      message: "Evaluación de la formación eliminada con éxito."
    };
  }
}
