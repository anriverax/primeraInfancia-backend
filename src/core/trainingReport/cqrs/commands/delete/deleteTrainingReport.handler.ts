import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrainingReportCommand } from "./deleteTrainingReport.command";
import { TrainingReportProjection } from "../../projections/trainingReport.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteTrainingReportCommand)
export class DeleteTrainingReportHandler implements ICommandHandler<DeleteTrainingReportCommand> {
  constructor(private readonly trainingReportProjection: TrainingReportProjection) {}
  async execute(command: DeleteTrainingReportCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingReportProjection.delete(data);

    return {
      statusCode: 200,
      message: "Informe de formación eliminado con éxito."
    };
  }
}
