import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateGroupTrainer } from "../../../dto/groupTrainer.type";
import { GroupTrainer } from "@prisma/client";

export class CreateGroupTrainerCommand extends Command<NestResponse<GroupTrainer>> {
  constructor(public readonly data: ICreateGroupTrainer) {
    super();
  }
}
