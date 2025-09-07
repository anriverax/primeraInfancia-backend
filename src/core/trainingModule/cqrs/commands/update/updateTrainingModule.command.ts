import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateTrainingModule } from "../../../dto/trainingModule.type";

export class UpdateTrainingModuleCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateTrainingModule) {
    super();
  }
}
