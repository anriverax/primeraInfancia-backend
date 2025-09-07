import { NestResponse } from "@/common/helpers/types";
import { IDeleteTrainingModule } from "@/core/trainingModule/dto/trainingModule.type";
import { Command } from "@nestjs/cqrs";

export class DeleteTrainingModuleCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteTrainingModule) {
    super();
  }
}
