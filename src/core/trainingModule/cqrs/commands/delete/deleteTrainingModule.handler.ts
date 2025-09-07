import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrainingModuleCommand } from "./deleteTrainingModule.command";
import { TrainingModuleProjection } from "../../projections/trainingModule.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteTrainingModuleCommand)
export class DeleteTrainingModuleHandler implements ICommandHandler<DeleteTrainingModuleCommand> {
  constructor(private readonly trainingModuleProjection: TrainingModuleProjection) {}
  async execute(command: DeleteTrainingModuleCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trainingModuleProjection.delete(data);

    return {
      statusCode: 200,
      message: "Módulo formativo eliminado con éxito."
    };
  }
}
