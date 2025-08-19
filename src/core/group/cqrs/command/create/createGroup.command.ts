import { NestResponse } from "@/common/helpers/types";
import { ICreateGroup } from "@/core/group/dto/group.type";
import { Command } from "@nestjs/cqrs";
import { Group } from "@prisma/client";

export class CreateGroupCommand extends Command<NestResponse<Group>> {
  constructor(public readonly data: ICreateGroup) {
    super();
  }
}
