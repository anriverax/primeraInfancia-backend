import { NestResponse } from "@/common/helpers/dto";
import { IDeleteGroupTrainer } from "@/core/groupTrainer/dto/groupTrainer.type";
import { Command } from "@nestjs/cqrs";

export class DeleteGroupTrainerCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteGroupTrainer) {
    super();
  }
}
