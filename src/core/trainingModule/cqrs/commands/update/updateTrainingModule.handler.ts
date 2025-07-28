import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrainingModuleCommand } from "./updateTrainingModule.command";
import { TrainingModuleProjection } from "../../projections/trainingModule.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateTrainingModuleCommand)
export class UpdateTrainingModuleHandler implements ICommandHandler<UpdateTrainingModuleCommand> {
  constructor(private readonly trainingModuleProjection: TrainingModuleProjection) {}
  async execute(command: UpdateTrainingModuleCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingModuleProjection.update(data);

    return {
      statusCode: 200,
      message: "Módulo formativo actualizado con éxito."
    };
  }
}
