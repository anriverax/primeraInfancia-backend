import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrainingReportCommand } from "./updateTrainingReport.command";
import { TrainingReportProjection } from "../../projections/trainingReport.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateTrainingReportCommand)
export class UpdateTrainingReportHandler implements ICommandHandler<UpdateTrainingReportCommand> {
  constructor(private readonly trainingReportProjection: TrainingReportProjection) {}
  async execute(command: UpdateTrainingReportCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingReportProjection.update(data);

    return {
      statusCode: 200,
      message: "Informe de formación actualizado con éxito."
    };
  }
}
