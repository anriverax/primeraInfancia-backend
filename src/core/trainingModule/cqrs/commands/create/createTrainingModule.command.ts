import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateTrainingModule } from "../../../dto/trainingModule.type";
import { TrainingModule } from "@prisma/client";

export class CreateTrainingModuleCommand extends Command<NestResponse<TrainingModule>> {
  constructor(public readonly data: ICreateTrainingModule) {
    super();
  }
}
