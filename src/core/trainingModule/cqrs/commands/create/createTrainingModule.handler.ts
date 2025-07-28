import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrainingModuleCommand } from "./createTrainingModule.command";
import { TrainingModuleProjection } from "../../projections/trainingModule.projection";
import { NestResponse } from "@/common/helpers/dto";
import { TrainingModule } from "@prisma/client";

@CommandHandler(CreateTrainingModuleCommand)
export class CreateTrainingModuleHandler implements ICommandHandler<CreateTrainingModuleCommand> {
  constructor(private readonly trainingModuleProjection: TrainingModuleProjection) {}
  async execute(command: CreateTrainingModuleCommand): Promise<NestResponse<TrainingModule>> {
    const { data } = command;

    const res = await this.trainingModuleProjection.create(data);

    return {
      statusCode: 201,
      message: "Módulo formativo creado con éxito.",
      data: res
    };
  }
}
