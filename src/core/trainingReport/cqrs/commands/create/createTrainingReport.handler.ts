import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrainingReportCommand } from "./createTrainingReport.command";
import { TrainingReportProjection } from "../../projections/trainingReport.projection";
import { NestResponse } from "@/common/helpers/types";
import { TrainingReport } from "@prisma/client";

@CommandHandler(CreateTrainingReportCommand)
export class CreateTrainingReportHandler implements ICommandHandler<CreateTrainingReportCommand> {
  constructor(private readonly trainingReportProjection: TrainingReportProjection) {}
  async execute(command: CreateTrainingReportCommand): Promise<NestResponse<TrainingReport>> {
    const { data } = command;

    const res = await this.trainingReportProjection.create(data);

    return {
      statusCode: 201,
      message: "Informe de formación creado con éxito.",
      data: res
    };
  }
}
