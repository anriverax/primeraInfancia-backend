import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateTrainingModule } from "../../../dto/trainingModule.type";
import { TrainingModule } from "@prisma/client";

export class CreateTrainingModuleCommand extends Command<NestResponse<TrainingModule>> {
  constructor(public readonly data: ICreateTrainingModule) {
    super();
  }
}
