import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateGroupTrainer } from "../../../dto/groupTrainer.type";

export class UpdateGroupTrainerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateGroupTrainer) {
    super();
  }
}
